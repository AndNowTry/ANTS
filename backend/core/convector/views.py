import uuid
import json
import time
import redis
from django.http import StreamingHttpResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser
from .tasks import process_file
from .limits import can_user_process, increment_active
from core.responses import success_response
from rest_framework import status
import tempfile
import os


r = redis.Redis(host='127.0.0.1', port=6379, db=0)


class UploadFileView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get("file")
        file_type_come = request.data.get("file_type_come")
        file_type_need = request.data.get("file_type_need")

        if not file:
            return success_response(
                data={"message": "No file provided"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        is_guest = not user.is_authenticated

        allowed, reason = can_user_process(user)
        if not allowed:
            return success_response(
                data={"message": reason},
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )

        task_id = str(uuid.uuid4())

        file_path = os.path.join(tempfile.gettempdir(), f"{task_id}_{file.name}")
        with open(file_path, "wb") as f:
            for chunk in file.chunks():
                f.write(chunk)

        if is_guest:
            process_file.apply_async(
                args=[file_path, file_type_come, file_type_need, task_id],
                queue="guest_queue"
            )
        else:
            increment_active(str(user.id))
            process_file.apply_async(
                args=[file_path, file_type_come, file_type_need, task_id, str(user.id)],
                queue="user_queue"
            )

        return success_response(
            data={"task_id": task_id},
            status_code=status.HTTP_201_CREATED
        )



class FileStatusSSEView(View):
    def get(self, request, task_id):
        last_id = int(request.headers.get("Last-Event-ID", 0))

        def stream():
            event_id = last_id
            while True:
                raw = r.get(f"task:{task_id}")

                if not raw:
                    yield f"data: {json.dumps({'status': 'pending'})}\n\n"
                    time.sleep(0.5)
                    continue

                data = json.loads(raw)
                event_id += 1

                yield f"id: {event_id}\n"
                yield f"data: {json.dumps(data)}\n\n"

                if data["status"] in ("done", "error"):
                    break

                time.sleep(0.5)

        response = StreamingHttpResponse(
            stream(),
            content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        return response

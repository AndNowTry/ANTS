import os
import redis
import json
import time
from celery import shared_task
from .engine import FileConverter
from django.conf import settings


r = redis.Redis(host='localhost', port=6379, db=0)


def set_status(task_id, status, progress=0, file_url=None, error=None):
    data = {"status": status, "progress": progress}
    if file_url:
        data["file_url"] = file_url
    if error:
        data["error"] = error
    r.set(f"task:{task_id}", json.dumps(data), ex=3600)


def decrement_active(user_id):
    key = f"active:{user_id}"
    count = int(r.get(key) or 0)
    if count > 1:
        r.decr(key)
    else:
        r.delete(key)


@shared_task(bind=True)
def process_file(self, file_path, file_type_come, file_type_need, task_id, user_id=None):
    try:
        set_status(task_id, "initialize", progress=0)

        output_dir = settings.MEDIA_ROOT
        converter = FileConverter()
        image_exts = ["png", "jpg", "jpeg", "webp"]
        video_exts = ["mp4", "mov", "avi", "mkv", "flv", "wmv"]
        audio_exts = ["mp3", "wav", "aac", "flac", "ogg", "m4a"]
        doc_exts = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]

        result = None

        set_status(task_id, "select the required type", progress=10)

        if file_type_come in image_exts and file_type_need in image_exts:
            set_status(task_id, "start the the conversion", progress=20)
            result = converter.convert_image(file_path, file_type_need, output_dir)
        elif file_type_come in image_exts and file_type_need == "pdf":
            set_status(task_id, "start the the conversion", progress=20)
            result = converter.convert_image_to_pdf(file_path, output_dir)
        elif file_type_come in doc_exts and file_type_need == "pdf":
            set_status(task_id, "start the the conversion", progress=20)
            result = converter.convert_document_to_pdf(file_path, output_dir)
        elif file_type_come in video_exts and file_type_need == "mp4":
            set_status(task_id, "start the the conversion", progress=20)
            result = converter.convert_ffmpeg(file_path, "mp4", output_dir)
        elif file_type_come in audio_exts and file_type_need == "mp3":
            set_status(task_id, "start the the conversion", progress=20)
            result = converter.convert_ffmpeg(file_path, "mp3", output_dir)
        else:
            set_status(task_id, "error", error="Unsupported conversion")
            return

        set_status(task_id, "ready for done", progress=80)

        set_status(task_id, "done", progress=100, file_url=f"/media/{os.path.basename(result)}")

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        set_status(task_id, "error", error=str(e))

    finally:
        if user_id:
            decrement_active(user_id)
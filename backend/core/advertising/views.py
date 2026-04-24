from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import Advertisement
from .serializers import AdvertisementSerializer
from core.responses import success_response
import random


class AdvertisementView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        count = int(request.query_params.get("count", 5))
        now = timezone.now()

        expired = Advertisement.objects.filter(ends_at__lt=now)
        for ad in expired:
            try:
                if os.path.exists(ad.image.path):
                    os.remove(ad.image.path)
            except Exception:
                pass
        expired.delete()


        ads = list(
            Advertisement.objects.filter(
                is_active=True,
                starts_at__lte=now,
                ends_at__gte=now,
            )
        )

        if len(ads) > count:
            ads = random.sample(ads, count)

        serializer = AdvertisementSerializer(ads, many=True, context={"request": request})
        return success_response(data=serializer.data)
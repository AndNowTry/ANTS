from django.utils import timezone
from dateutil.relativedelta import relativedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from core.responses import success_response
from rest_framework import status


PLAN_PRICES = {
    "api": "7.99",
    "professional": "9.99",
}


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan = request.data.get("plan")
        card_number = request.data.get("card_number", "").replace(" ", "")

        if plan not in PLAN_PRICES:
            return success_response(
                data={"message": "Invalid plan"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if Subscription.objects.filter(user=request.user, plan=plan, is_active=True).exists():
            return success_response(
                data={"message": "You already have an active subscription for this plan"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if not card_number.startswith("0000"):
            return success_response(
                data={"message": "Payment declined. Invalid card."},
                status_code=status.HTTP_402_PAYMENT_REQUIRED
            )

        profile = request.user.profile
        profile.level = plan
        profile.save(update_fields=["level"])

        expires_at = timezone.now() + relativedelta(months=1)
        Subscription.objects.create(
            user=request.user,
            plan=plan,
            expires_at=timezone.now() + relativedelta(months=1),
            is_active=True,
        )

        return success_response(
            data={
                "message": "Payment successful",
                "plan": plan,
                "expires_at": expires_at,
            }
        )


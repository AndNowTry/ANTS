from django.urls import path
from .views import PaymentView

urlpatterns = [
    path("Payment/", PaymentView.as_view(), name="Payment"),
]
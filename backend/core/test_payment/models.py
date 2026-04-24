from django.conf import settings
from django.db import models


class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.CharField(max_length=20)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "subscriptions"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "plan"],
                condition=models.Q(is_active=True),
                name="unique_active_plan"
            )
        ]

    def __str__(self):
        return f"{self.user.email}: {self.plan} - {self.expires_at}"
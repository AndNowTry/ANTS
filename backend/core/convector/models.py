from django.db import models
from django.conf import settings


class History(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="history")
    original_filename = models.CharField(max_length=600)
    original_file_type = models.CharField(max_length=10)
    original_file_size = models.PositiveIntegerField()
    new_filename = models.CharField(max_length=600)
    new_file_type = models.CharField(max_length=10)
    new_file_size = models.PositiveIntegerField()
    new_file_path = models.FileField(upload_to="history/")
    end_status = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "history"

    def __str__(self):
        return f"{self.user.email} - {self.original_filename}"

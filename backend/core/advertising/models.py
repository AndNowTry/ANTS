from django.db import models


class Advertisement(models.Model):
    image = models.ImageField(upload_to="ads/")
    title = models.CharField(max_length=200, blank=True)
    link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()

    class Meta:
        db_table = "advertisements"

    def __str__(self):
        return f"{self.title}: ({self.starts_at} — {self.ends_at})"
from django.contrib import admin
from .models import History


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = ("original_filename", "original_file_size", "new_filename", "new_file_size", "end_status")
    ordering = ("-created_at",)
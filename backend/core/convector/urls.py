from django.urls import path
from .views import UploadFileView, FileStatusSSEView

urlpatterns = [
    path("upload/", UploadFileView.as_view(),  name="file-upload"),
    path("status/<str:task_id>/", FileStatusSSEView.as_view(), name="file-status"),
]
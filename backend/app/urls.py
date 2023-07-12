from django.urls import path
from .views import FileUploadView, FileDownloadView, UserLoginView, UserRegistrationView, FileShareView, SharedFilesView, MyFilesView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('download/<int:file_id>/', FileDownloadView.as_view(), name='file-download'),
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('shared-with-me/', SharedFilesView.as_view(), name='shared-files'),
    path('share/', FileShareView.as_view(), name='file-share'),
    path('my-files/', MyFilesView.as_view(), name='my-files'),
]

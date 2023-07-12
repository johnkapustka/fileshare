import uuid
from django.db import models
from django.contrib.auth.models import User

def generate_uuid():
    return str(uuid.uuid4())

class File(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField()
    encryption_key = models.CharField(max_length=256, null=True)
    user = models.ForeignKey(User, related_name='files', on_delete=models.CASCADE, null=True)
    original_file_name = models.CharField(max_length=255, null=True)
    shared_with_users = models.ManyToManyField(User, related_name='shared_files')


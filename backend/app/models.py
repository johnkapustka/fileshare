import uuid
from django.db import models

def generate_uuid():
    return str(uuid.uuid4())

class File(models.Model):
    file = models.FileField(upload_to='uploads/')
    download_code = models.CharField(max_length=36, default=generate_uuid, unique=True)
    original_file_name = models.CharField(max_length=255, null=True)
    encryption_key = models.BinaryField(null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

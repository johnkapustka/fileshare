from django.core.files.base import ContentFile
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, renderers
from .serializers import FileSerializer
from .models import File
from .crypto import encrypt_file, decrypt_file, get_random_bytes
from django.http import HttpResponse
import os

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file = request.data['file']
            encryption_key = get_random_bytes(16)
            encrypted_file = encrypt_file(file, encryption_key)
            django_file = ContentFile(encrypted_file.getvalue())
            django_file.name = file.name 
            file_serializer.save(file=django_file, encryption_key=encryption_key, original_file_name=file.name)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class FileDownloadView(APIView):
    renderer_classes = [renderers.StaticHTMLRenderer]

    def get(self, request, format=None):
        code = request.query_params.get('code')
        file = File.objects.get(download_code=code)
        if file.encryption_key is None:
            return Response('Invalid file.', status=status.HTTP_400_BAD_REQUEST)
        
        decrypted_file_content = decrypt_file(file.file, file.encryption_key)
        response = HttpResponse(decrypted_file_content, content_type='application/octet-stream')

        # Extract just the filename (no directories)
        filename = os.path.basename(file.original_file_name)

        response['Content-Disposition'] = 'attachment; filename={}'.format(filename)
        return response

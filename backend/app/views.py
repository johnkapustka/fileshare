from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, renderers, generics
from rest_framework.authentication import TokenAuthentication
from .serializers import FileSerializer
from .models import File
from .crypto import encrypt_file, decrypt_file, get_random_bytes
from django.http import HttpResponse, FileResponse
from django.core.files.base import ContentFile
import os

class UserRegistrationView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response(
                {"error": "Username and Password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(username=username, password=password)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class FileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file = request.data['file']
            encryption_key = get_random_bytes(16)
            encrypted_file = encrypt_file(file, encryption_key)
            django_file = ContentFile(encrypted_file.getvalue())
            django_file.name = file.name 
            file_serializer.save(file=django_file, encryption_key=encryption_key, original_file_name=file.name, user=request.user)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class FileDownloadView(APIView):
    renderer_classes = [renderers.StaticHTMLRenderer]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated] 

    def get(self, request, file_id, format=None):
        file_id = self.kwargs['file_id']  
        file = File.objects.get(id=file_id, user=request.user)
        if file.encryption_key is None:
            return Response('Invalid file.', status=status.HTTP_400_BAD_REQUEST)
        
        decrypted_file_content = decrypt_file(file.file, file.encryption_key)
        response = HttpResponse(decrypted_file_content, content_type='application/octet-stream')

        # Extract just the filename (no directories)
        filename = os.path.basename(file.original_file_name)

        response['Content-Disposition'] = 'attachment; filename={}'.format(filename)
        return response

class SharedFilesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FileSerializer

    def get_queryset(self):
        user = self.request.user
        return File.objects.filter(shared_with_users=user)

class FileShareView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file_id = request.data.get('file_id')
        username_to_share_with = request.data.get('username_to_share_with')

        if file_id and username_to_share_with:
            file_to_share = File.objects.get(id=file_id, user=request.user)
            user_to_share_with = User.objects.get(username=username_to_share_with)
            file_to_share.shared_with_users.add(user_to_share_with)
            file_to_share.save()

            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response({"error": "File ID and username required"}, status=status.HTTP_400_BAD_REQUEST)

class MyFilesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        files = File.objects.filter(user=request.user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)


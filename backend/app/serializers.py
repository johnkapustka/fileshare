from rest_framework import serializers
from .models import File, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class FileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    shared_with_users = serializers.StringRelatedField(many=True)

    class Meta:
        model = File
        fields = ['id', 'file', 'uploaded_at', 'user', 'original_file_name', 'shared_with_users']
        read_only_fields = ['id', 'uploaded_at', 'user']

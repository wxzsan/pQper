from .models import User
from rest_framework import serializers

class star_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['star_user_list']

class information_serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_name','user_email','user_photo']
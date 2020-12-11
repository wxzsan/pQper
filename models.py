from django.db import models
import json

# Create your models here.
import datetime
from django.utils import timezone

class User(models.Model):
    user_id = models.IntegerField(default = 0)
    user_namae = models.CharField(max_length=20)
    user_password = models.CharField(max_length=20)
    user_email = models.CharField(max_length=50)
    privilege = models.BooleanField(default = False) #false 表示没有管理员权限
    user_photo = models.FileField()

    
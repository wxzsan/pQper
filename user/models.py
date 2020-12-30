from django.db import models
import json

# Create your models here.
import datetime
from django.utils import timezone

class User(models.Model):
    user_name = models.CharField(max_length=20)
    user_password = models.CharField(max_length=20)
    user_email = models.CharField(max_length=50)
    privilege = models.BooleanField(default = False) #false 表示没有管理员权限
    #user_photo = models.FileField() 谁添加的呀？下面已经有了
    star_user_list = models.ManyToManyField("self", symmetrical=False)
    user_photo = models.FileField(upload_to='avatar',default='avatars/default.jpg')
    active = models.BooleanField(default = False) #false 表示没有验证
    verification=models.CharField(max_length=12) #验证码
    def __str__(self):
            return str(self.pk) + "----" + self.user_name
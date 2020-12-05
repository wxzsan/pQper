from django.db import models
import numpy

# Create your models here.
class User(models.Model):
    #id = models.IntegerField(default = 0);
    name = models.CharField(max_length = 20);
    password = models.CharField(max_length = 20);
    privilege = models.BooleanField(default = False); #false 表示没有管理员权限
    photo = models.ImageField();
    email = models.CharField(max_length = 40);



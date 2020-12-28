from django.db import models

# Create your models here.

class ChatGroup(models.Model):
    name = models.CharField(max_length=255)
    user_list = models.ManyToManyField('user.User', related_name='my_chat_group')
    paper = models.ForeignKey('commmentarea.Paper', on_delete=models.CASCADE)
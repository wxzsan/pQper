from django.db import models

# Create your models here.

class StarPaperList(models.Model):
    email = models.CharField(max_length = 40);
    user_id = models.IntegerField(default = 0);
    Star_Paper_List = models.ManyToManyField('commentarea.Paper');

class StarCommentList(models.Model):
    email = models.CharField(max_length = 40);
    user_id = models.IntegerField(default = 0);
    Star_Comment_List = models.ManyToManyField('commentarea.LongComment');


class StarUserList(models.Model):
    email = models.CharField(max_length = 40);
    user_id = models.IntegerField(default = 0);
    Star_User_List = models.ManyToManyField('user.User');

class MyCommentAreaList(models.Model):
    email = models.CharField(max_length = 40);
    user_id = models.IntegerField(default = 0);
    My_CommentArea_List = models.ManyToManyField('commentarea.CommentArea');

from django.db import models

# Create your models here.
class Paper(models.Model):
    title = models.CharField(max_length=255)
    path = models.CharField(max_length=255)

class ShortComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE)
    post_time = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=255)
    rose_number = models.IntegerField(default=0)
    egg_number = models.IntegerField(default=0)
    rose_user_list = models.ManyToManyField('user.User')
    egg_user_list = models.ManyToManyField('user.User')

class LongComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE)
    post_time = models.DateTimeField(auto_now_add=True)
    abstract = models.CharField(max_length=255)
    star_number = models.IntegerField(default=0)
    comment_address = models.CharField(max_length=255)
    short_comment_list = models.ManyToManyField(ShortComment)

class CreateRequest(models.Model):
    requestor = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)

class CommentArea(models.Model):
    name = models.CharField(max_length=255)
    master = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)
    long_comment_list = models.ManyToManyField(LongComment)
    short_comment_list = models.ManyToManyField(ShortComment)

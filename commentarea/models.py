from django.db import models

# Create your models here.
class Paper(models.Model):
    title = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    #paper = models.FileField(upload_to = 'papers')

    def __str__(self):
        return str(self.id) + '--' + self.title

class PaperFile(models.Model):
    title = models.CharField(max_length=255)
    paper = models.FileField(upload_to = 'papers')

class ShortComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name = 'post_short_comment')
    post_time = models.DateTimeField(auto_now_add=True)
    content = models.CharField(max_length=255)
    rose_number = models.IntegerField(default=0)
    egg_number = models.IntegerField(default=0)
    rose_user_list = models.ManyToManyField('user.User', related_name='rose_short_comment')
    egg_user_list = models.ManyToManyField('user.User', related_name='egg_short_comment')

class LongComment(models.Model):
    poster = models.ForeignKey('user.User', on_delete=models.CASCADE, related_name='post_long_comment')
    post_time = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length = 255)
    star_number = models.IntegerField(default=0)
    star_user_list = models.ManyToManyField('user.User', related_name='star_long_comment')
    content = models.TextField()
    short_comment_list = models.ManyToManyField(ShortComment)

class CreateRequest(models.Model):
    requestor = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)
    paper_title = models.CharField(max_length=255)

class CommentArea(models.Model):
    name = models.CharField(max_length=255)
    master = models.ForeignKey('user.User', on_delete=models.CASCADE)
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE)
    long_comment_list = models.ManyToManyField(LongComment)
    short_comment_list = models.ManyToManyField(ShortComment)
    star_number = models.IntegerField(default = 0)
    star_user_list = models.ManyToManyField('user.User', related_name='star_comment_area')

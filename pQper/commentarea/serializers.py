from commentarea.models import *
from rest_framework import serializers

class CommentAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentArea
        fields = ['id', 'name', 'master', 'paper', 'long_comment_list', 'short_comment_list', 'star_number', 'star_user_list']

class CommentAreaInListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentArea
        #依旧这里只发送id
        fields = ['id']

class CreateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateRequest
        fields = ['id', 'requestor', 'paper']

class LongCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongComment
        fields = ['id', 'poster','post_time', 'title', 'star_number', 'content', 'short_comment_list']

# 当前用户是否关注，以及内容的截取需要单独处理，就不分到这里了
class LongCommentInCommentAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongComment
        fields = ['id', 'poster', 'post_time','title', 'star_number']

class LongCommentInListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongComment
        ##只发送id
        fields = ['id']


class ShortCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortComment
        fields = ['id', 'poster', 'post_time', 'content', 'rose_number', 'egg_number', 'rose_user_list', 'egg_user_list']

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ['path', 'title']
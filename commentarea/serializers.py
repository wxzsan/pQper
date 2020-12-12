from commentarea.models import *
from rest_framework import serializers

class CommentAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentArea
        fields = ['id', 'name', 'master', 'paper', 'long_comment_list', 'short_comment_list', 'star_user_list']

class CreateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreateRequest
        fields = ['id', 'requestor', 'paper']

class LongCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LongComment
        fields = ['id', 'poster','post_time', 'title', 'star_number', 'star_user_list', 'content', 'short_comment_list']

class ShortCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortComment
        fields = ['id', 'poster', 'post_time', 'content', 'rose_number', 'egg_number', 'rose_user_list', 'egg_user_list']

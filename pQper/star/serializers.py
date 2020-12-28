from star.models import *
from rest_framework import serializers

class StarPaperListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarPaperList
        fields = ['email', 'user_id' , 'Star_Paper_List']

class StarCommentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarCommentList
        fields = ['email', 'user_id' , 'Star_Comment_List']

class StarUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarUserList
        fields = ['email', 'user_id' ,'Star_User_List']

class MyCommentAreaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyCommentAreaList
        fields = ['email', 'user_id' , 'My_CommentArea_List']
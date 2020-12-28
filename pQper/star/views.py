from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from user.models import User
from .models import *
from star.serializers import *
import requests
import json


@csrf_exempt
def Creat_StarPaperListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        email = json.loads(request.body)['email']
        paper = StarPaperList(email=email, user_id=id)
        paper.save()
        response['code'] = 200
        response['data'] = {'msg': "success"}
        return JsonResponse(response)


@csrf_exempt
def StarPaperListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        try:
            paper = StarPaperList.objects.get(user_id=id)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "UserID is wrong"}
            return JsonResponse(response)
        response['code'] = 200
        serializer = StarPaperListSerializer(paper)
        response['data'] = {'msg': "success", 'Star_Paper_List': serializer.data}
        return JsonResponse(response)


@csrf_exempt
def Creat_StarCommentListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        email = json.loads(request.body)['email']
        longcomment = StarCommentList(email=email, user_id=id)
        longcomment.save()
        response['code'] = 200
        response['data'] = {'msg': "success"}
        return JsonResponse(response)


@csrf_exempt
def StarCommentListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        try:
            longcomment = StarCommentList.objects.get(user_id=id)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "UserID is wrong"}
            return JsonResponse(response)
        response['code'] = 200
        serializer = StarCommentListSerializer(longcomment)
        response['data'] = {'msg': "success", 'Star_Comment_List': serializer.data}
        return JsonResponse(response)


@csrf_exempt
def Creat_StarUserListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        email = json.loads(request.body)['email']
        user = StarUserList(email=email, user_id=id)
        user.save()
        response['code'] = 200
        response['data'] = {'msg': "success"}
        return JsonResponse(response)


@csrf_exempt
def StarUserListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        try:
            user = StarUserList.objects.get(user_id=id)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "UserID is wrong"}
            return JsonResponse(response)
        response['code'] = 200
        serializer = StarUserListSerializer(user)
        response['data'] = {'msg': "success", 'Star_User_List': serializer.data}
        return JsonResponse(response)


@csrf_exempt
def Creat_MyCommentAreaListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        email = json.loads(request.body)['email']
        commentarea = MyCommentAreaList(email=email, user_id=id)
        commentarea.save()
        response['code'] = 200
        response['data'] = {'msg': "success"}
        return JsonResponse(response)


@csrf_exempt
def MyCommentAreaListPage(request):
    response = {}
    if request.method == 'POST':
        id = json.loads(request.body)['id']
        try:
            commentarea = MyCommentAreaList.objects.get(user_id=id)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "UserID is wrong"}
            return JsonResponse(response)
        response['code'] = 200
        serializer = MyCommentAreaListSerializer(commentarea)
        response['data'] = {'msg': "success", 'My_CommentArea_List': serializer.data}
        return JsonResponse(response)

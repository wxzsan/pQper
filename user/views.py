from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import User
import requests
import json

#这里王昕兆为了方便调试假的view，暂时不要删
@csrf_exempt
def adduser(request):
    response = {}
    if request.method == 'GET':
        name = request.GET.get('name')
        password = request.GET.get('password')
        email = request.GET.get('email')
        user = User(user_name = name, user_password = password, user_email = email)
        user.save()
        response['code'] = 200
        response['data'] = {'msg':"success"}
        return JsonResponse(response)

@csrf_exempt
def set_admin(request):
    reponse = {}
    if request.method == 'GET':
        id = request.GET.get('userId')
        try:
            user = User.objects.get(id = userId)
        except: User.DoesNotExist:
            response['code'] = 300
            response['data'] = {'msg': "user id does not exist"}
            eturn JsonResponse(response)
        user.privilege = True
        reponse['code'] = 200
        reponse['data'] = ['msg':"success"]
        return JsonResponse(response)
        


def check_cookie(request):
    try:
        userid = int(request.get_signed_cookie(key='userid', salt='yyh'))
    except:
        return -1
    return userid


@csrf_exempt 
def login(request):
    response = {}
    if request.method == 'POST':
        email = json.loads(request.body)['email']
        password = json.loads(request.body)['password']
        try:
            user = User.objects.get(user_email = email)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)
        if user.user_password == password:
            response['code'] = 200
            response['data'] = {'msg':"success"}
            #这里设置了cookie，最长使用时间为1小时
            userid=user.id
            jsonresponse = JsonResponse(response)
            jsonresponse.set_signed_cookie(key='userid', value=userid, salt='yyh',max_age=3600)
            return jsonresponse
        else:
            response['code'] = 300
            response['data'] = {'msg': "Password is wrong"}
            return JsonResponse(response)

@csrf_exempt
def register(request):
    response = {}
    if request.method == 'POST':
        try:
            email = json.loads(request.body)['email']
            password = json.loads(request.body)['password']
            name = json.loads(request.body)['name'] #理论上name是允许重复
        except:
            response['code'] = 300
            response['data'] = {'msg':"json wrong"}
            return JsonResponse(response)

        try:
            user = User.objects.get(user_email=email)
            response['code'] = 300
            response['data'] = {'msg':"Email has been registered"}
            return JsonResponse(response)
        except:
            response['code'] = 200
            response['data'] = {'msg':"success"}
            user = User(user_name = name, user_email = email, user_password = password)
            user.save()
            return JsonResponse(response)
    else:
        response['code'] = 300
        response['data'] = {'msg':"path wrong"}
        return JsonResponse(response)

@csrf_exempt
def get_user_information(request):
    response = {}
    if request.method == 'POST':
        #email_test = json.loads(request.body)['email']
        #先检查cookie
        userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        else:
            try:
                user = User.objects.get(id=userid)
                response['code'] = 200
                response['data'] = {'msg':"success", 'name':user.user_name, 'email':user.user_email,'photo':str(user.user_photo)}
                return JsonResponse(response)
            except:
                response['code'] = 300
                #if email == email_test:
                    #response['data'] = {'msg': "unkown wrong"}
                #else:
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)
            '''response['data'] = {'msg':"success", 'name':user.user_name, 'photo':str(user.user_photo), 'email':user.user_emali}
            return JsonResponse(response)'''
        

@csrf_exempt
def change_user_information(request):
    response = {}
    if request.method == 'POST':
        #先检查cookie
        userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        else:
            name = json.loads(request.body)['name']
            password = json.loads(request.body)['password']
            print(userid*3)
            try:
                user = User.objects.get(id=userid)
                print(2)
                response['code'] = 200
                if not name == "":
                    user.user_name = name
                if not password == "":
                    user.user_password = password
                user.save()
                response['data'] = {'msg':"success", 'name':user.user_name, 'password':user.user_password}
                return JsonResponse(response)

            except:
                response['code'] = 300
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)
        '''response['code'] = 200
        if name == "":
            user.user_name = name
        if password == "":
            user.user_password = password
        user.save()
        response['data'] = {'msg':"success", 'name':user.user_name, 'password':user.user_password}
        return JsonResponse(response)'''


@csrf_exempt
def upload_avatar(request):
    response = {}
    if request.method == 'POST':
        #先检查cookie
        userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        photo = json.loads(request.body)['photo']
        try:
            user = User.objects.get(id=userid)
            response['code'] = 200
            user.user_photo = photo
            user.save()
            response['data'] = {'msg':"success",'photo':str(user.user_photo)}
            return JsonResponse(response)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)
        
    
    
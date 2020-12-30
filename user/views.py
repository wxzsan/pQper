# Create your views here.
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import User
from .serializers import information_serializer, star_serializer
import requests
import json
from django.core.mail import send_mail
import random
from Crypto import Random
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5, PKCS1_OAEP
from django.conf import settings
import base64

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
def setadmin(request):
    response = {}
    if request.method == 'GET':
        name = request.GET.get('userId')
        user = User.objects.get(id=name)
        user.privilege = 1
        user.save()
        response['code'] = 200
        response['data'] = {'msg':"success"}
        return JsonResponse(response)


def check_cookie(request):
    try:
        userid = int(request.get_signed_cookie(key='userid', salt='yyh'))
    except:
        return -1
    return userid


@csrf_exempt 
def verify(request):
    response = {}
    if request.method == 'POST':
        try:
            email = json.loads(request.body)['email']
            verification = json.loads(request.body)['verification'] #理论上name是允许重复
        except:
            response['code'] = 300
            response['data'] = {'msg':"json wrong"}
            return JsonResponse(response)
        try:
            user = User.objects.get(user_email=email)
        except:
            response['code'] = 300
            response['data'] = {'msg':"user do not exist"}
            return JsonResponse(response)
        if verification == user.verification:
            user.active=True
            user.save()
            response['code'] = 200
            response['data'] = {'msg':"verify success"}
        else:
            response['code'] = 300
            response['data'] = {'msg':"verification is wrong"}
        return JsonResponse(response)

@csrf_exempt 
def login(request):
    response = {}
    if request.method == 'POST':
        email = json.loads(request.body)['email']
        password = json.loads(request.body)['password']
        password = decrypt_pass(password).decode()
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
            password = decrypt_pass(password).decode()
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
            verification = str(random.randint(0,9999999999))
            user = User(user_name = name, user_email = email, user_password = password, verification = verification)
        try:
            print(email)
            sending_email(verification, email)
        except:
            response['code'] = 300
            response['data'] = {'msg':"email adress is wrong"}
            return JsonResponse(response)
        response['code'] = 200
        response['data'] = {'msg':"success"}
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
        try:
            userid = json.loads(request.body)['id']
        except:
            #先检查cookie
            userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        else:
            try:
                print(userid)
                user = User.objects.get(id=userid)
                #print(user.user_photo)
            except:
                response['code'] = 300
                #if email == email_test:
                    #response['data'] = {'msg': "unkown wrong"}
                #else:
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)
            response['code'] = 200
            serializer=information_serializer(user)
            response['data'] = {'msg':"success", 'information':serializer.data}
            return JsonResponse(response)
        

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
        try:
            avatar= request.FILES.get('image',None)
            print(avatar)
        except:
            response['code'] = 300
            response['data'] = {'msg': "can't get photo"}
            return JsonResponse(response)
        try:
            user = User.objects.get(id=userid)
            response['code'] = 200
            user.user_photo = avatar
            print(user.user_photo)
            user.save()
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)

@csrf_exempt
def get_star_user_list(request):
    response = {}
    if request.method == 'POST':
        #先检查cookie
        userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        else:
            try:
                user = User.objects.get(id=userid)
                serializer = star_serializer(user)
                response['code'] = 200
                response['data'] = {'msg': "success",'star_user_list':serializer.data}
                #print("here")
                return JsonResponse(response)
            except:
                response['code'] = 300
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)

    elif request.method == 'GET':
        #print("here")
        #先检查cookie
        userid=check_cookie(request)
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        else:
            try:
                user = User.objects.get(id=userid)
                serializer = star_serializer(user)
                response['code'] = 200
                response['data'] = {'msg': "success",'star_user_list':serializer.data}
                return JsonResponse(response)
            except:
                response['code'] = 300
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)

    else:
        response['code'] = 300
        response['data'] = {'msg':"path wrong"}
        return JsonResponse(response)


@csrf_exempt
def add_star_user(request):
    response = {}
    if request.method == 'POST':
        #先检查cookie
        userid=check_cookie(request)
        starid = json.loads(request.body)['id']
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)

        try:
            user = User.objects.get(id=userid)
            star_user=User.objects.get(id=starid)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)

        try:
            star_user=User.objects.get(id=starid)
        except:
            response['code'] = 300
            response['data'] = {'msg': "Star User does not exist"}
            return JsonResponse(response)

        try:
            user.star_user_list.add(star_user)
            user.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User has been stared"}
            return JsonResponse(response)

@csrf_exempt
def remove_star_user(request):
    response = {}
    if request.method == 'POST':
        #先检查cookie
        userid=check_cookie(request)
        starid = json.loads(request.body)['id']
        if userid == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        try:
            user = User.objects.get(id=userid)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)

        try:
            star_user=User.objects.get(id=starid)
        except:
            response['code'] = 300
            response['data'] = {'msg': "User does not exist"}
            return JsonResponse(response)
            
        user.star_user_list.remove(star_user)
        user.save()
        response['code'] = 200
        response['data'] = {'msg': "success"}
        return JsonResponse(response)

@csrf_exempt
def logout(request):
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
                User.objects.get(id=userid)
                response['code'] = 200
                response['data'] = {'msg': "success"}
                jsonresponse = JsonResponse(response)
                jsonresponse.set_signed_cookie(key='userid', value=userid, salt='yyh',max_age=1)
                print(userid)
                return jsonresponse
            except:
                response['code'] = 300
                #if email == email_test:
                    #response['data'] = {'msg': "unkown wrong"}
                #else:
                response['data'] = {'msg': "User does not exist"}
                return JsonResponse(response)

def sending_email(ver, email):
        string = "验证码:"+ver+"\n验证网址: http://127.0.0.1:8000/user/verify.html \n请勿将验证码泄露给他人！"
        send_mail(subject="验证邮件",
                message=string,
                from_email='1192359897@qq.com',  #发送者邮箱
                recipient_list=[email], # 接收者邮箱可以写多个
                fail_silently=False)

def decrypt_pass(password):
    random_generator = Random.new().read
    RSA.generate(1024, random_generator)
    rsakey = RSA.importKey(settings.RSA_PRIVATE_KEY)
    cipher = PKCS1_v1_5.new(rsakey)
    return cipher.decrypt(base64.b64decode(password), random_generator)

@csrf_exempt
def passwordtest(request):
    response = {}
    if request.method == 'POST':
        text = json.loads(request.body)['password']
        password = decrypt_pass(text).decode()
        response['code'] = 200
        response['data'] = {'msg': "success", "password":password}
        return JsonResponse(response)

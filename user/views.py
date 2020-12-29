from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import User
import requests
import json
import os
import sys
sys.path.append('..')
from pQper_demo.settings import BASE_DIR
@csrf_exempt 
def login(request):
    response = {}
    if request.method == 'POST':
        email = json.loads(request.body)['email']
        password = json.loads(request.body)['password']
        try:
            user = User.objects.get(email = email)
        except:
            response['code'] = 300
            print('fail')
            response['data'] = {'msg': "Password is wrong"}
            return JsonResponse(response)
        if user.password == password:
            response['code'] = 200
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': "Password is wrong"}
            return JsonResponse(response)
@csrf_exempt
def register(request):
    response = {}
    if request.method == 'POST':
        email = json.loads(request.body)['email']
        password = json.loads(request.body)['password']
        name = json.loads(request.body)['name']
        try:
            user = User.objects.get(email=email)
            response['code'] = 300
            response['data'] = {'msg':"Email has been registered"}
            return JsonResponse(response)
        except:
            response['code'] = 200
            user = User(name = name, email = email, password = password)
            user.save()
            return JsonResponse(response)

@csrf_exempt
def get_icon(request):
    response = {}
    if request.method == 'GET':
        test_file = open(os.path.join(BASE_DIR,'user/media/annotation-noicon.svg'), 'rb')
        response = HttpResponse(content=test_file)
        response['Content-Type'] = 'application/svg'
        response['Content-Disposition'] = 'attachment; filename="%s.svg"' \
                                    % 'whatever'
        return response

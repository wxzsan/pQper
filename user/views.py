from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from .models import User
from django.http import JsonResponse
# Create your views here.
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
        
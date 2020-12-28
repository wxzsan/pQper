from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import sys
from django.http import HttpResponse, Http404, FileResponse

sys.path.append('..')
from commentarea.models import Paper
from .models import *
from django.core import serializers
from django.forms.models import model_to_dict
from .forms import *
from user.views import check_cookie
from pQper.settings import *

import os

import fitz

# Create your views here.
@csrf_exempt
def add_annotation(request):
    response = {}

    user_id = check_cookie(request)
    #检查cookie
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'POST':
        form = AddAnnotationForm(json.loads(request.body))
        if form.is_valid():
            #获取相对坐标
            x = form.cleaned_data['x']
            y = form.cleaned_data['y']
            page_num = form.cleaned_data['pageNum']
            paper_id = form.cleaned_data['paperId']
            content = form.cleaned_data['content']
            try:
                paper = Paper.objects.get(id=paper_id)
            except Paper.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "paper id does not exist"}
                return JsonResponse(response)
            full_path = MEDIA_ROOT + '/' + paper.path
            print(MEDIA_ROOT + '/' + paper.path)
            #打开并获取对应的页
            doc = fitz.open(full_path)
            page = doc.loadPage(page_num)
            rect = page.rect
            #这里乘上这一页的宽和高获取绝对坐标
            top_left = (x*rect[2], y*rect[3])
            #添加批注
            annot = page.addTextAnnot(top_left, content)
            doc.save(full_path, incremental = True, encryption = False)
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)
    else:
        response['code'] = 300
        response['data'] = {'msg':'wrong http method, you should use POST method'}
        return JsonResponse(response)


@csrf_exempt
def getChatGroupPapers(request):
    response = {}
    if request.method == 'GET':
        debugflag = True
        if debugflag == False:
            # 根据 cookie 判断能否查看动态
            if check_cookie(request) == -1:
                response['code'] = 300
                response['data'] = {'msg': 'cookie out of date'}
                return JsonResponse(response)

        groupId = request.GET.get('chatGroupId')

        try:
            paperlist = list(
                ChatGroup.objects.get(id = groupId).paper.values("id", "title", "path")
            )
            response['code'] = 200
            response['data'] = {
                "msg": "success",
                "paperList" : paperlist
            }

            return JsonResponse(response)
        except:
                return JsonResponse({{"code" : 300}, {"msg", "db corrupted"}})  
        
    else:
        # 请用 GET
        return JsonResponse({ {"code" : 600}, 
        {"msg" : "incorrect request method"}})


@csrf_exempt
def getChatGroupMenbers(request):
    response = {}
    if request.method == 'GET':
        debugflag = True
        if debugflag == False:
            # 根据 cookie 判断能否查看动态
            if check_cookie(request) == -1:
                response['code'] = 300
                response['data'] = {'msg': 'cookie out of date'}
                return JsonResponse(response)

        groupId = request.GET.get('chatGroupId')

        try:
            userlist = list(
                ChatGroup.objects.get(id = groupId).user_list.values("id", "user_name", "user_photo")
            )
            response['code'] = 200
            response['data'] = {
                "msg": "success",
                "paperList" : userlist
            }

            return JsonResponse(response)
        except:
                return JsonResponse({{"code" : 300}, {"msg", "db corrupted"}})  
        
    else:
        # 请用 GET
        return JsonResponse({ {"code" : 600}, 
        {"msg" : "incorrect request method"}})
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

from user.models import User

import os

import fitz

from commentarea.models import PaperFile, Paper

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
            response["code"] = 300
            response["data"] = {
                "msg" : "database corrupted"
            }
            return JsonResponse(response)
    else:
        # 请用 GET
        response["code"] = 600
        response["data"] = {
            "msg" : "incorrect request method"
        }
        return JsonResponse(response)

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
                "userlist" : userlist
            }

            return JsonResponse(response)
        except:
            response["code"] = 300
            response["data"] = {
                "msg" : "database corrupted"
            }
            return JsonResponse(response)
    else:
        # 请用 GET
        response["code"] = 600
        response["data"] = {
            "msg" : "incorrect request method"
        }
        return JsonResponse(response)


@csrf_exempt
def createChatGroup(request):
    response = {}
    if request.method == 'POST':
        debugflag = True
        if debugflag == False:
            # 根据 cookie 判断能否查看动态
            if check_cookie(request) == -1:
                response['code'] = 300
                response['data'] = {'msg': 'cookie out of date'}
                return JsonResponse(response)

        groupName = json.loads(request.body)['groupName']

        if ChatGroup.objects.filter(name = groupName).exists():
            response['code'] = 400
            response['data'] = {
                "msg" : "ChatGroup already exists"
            }
            return JsonResponse(response)

        memberList = json.loads(request.body)['userList']

        newChatGroup = ChatGroup()  
        newChatGroup.save()
        newChatGroup.name = groupName
        try:
            for mb in memberList:
                mbId = mb['userId']
                user = User.objects.get(id=mbId)
                newChatGroup.user_list.add(user)
            newChatGroup.save()

            response["code"] = 200
            response["data"] = {
                "msg" : "success",
                "groupId" : newChatGroup.id
            }
        except:
            response["code"] = 300
            response["data"] = {
                "msg" : "database corrupted"
            }
            return JsonResponse(response)
        
        return JsonResponse(response)
    else:
        # 请用 GET
        response["code"] = 600
        response["data"] = {
            "msg" : "incorrect request method"
        }
        return JsonResponse(response)

@csrf_exempt
def uploadChatGroupPaper(request):
    # 论文直接上传到公共论文的数据库中
    # 然后再在ChatGroup的PaperList里面增加这篇论文的引用
        
    response = {}
    if request.method == 'POST':

        debugflag = True
        if debugflag == False and check_cookie(request) == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        
        form = ChatGroupPaperForm(request.POST, request.FILES)
        if form.is_valid():
            paper_file = PaperFile(title = form.cleaned_data["title"],
                                   paper = request.FILES['paper'])
            paper_file.save()
            paper = Paper(title = paper_file.title, 
                          path = paper_file.paper.name)
            paper.save()

            try:
                chatGroup = ChatGroup.objects.get(id = form.cleaned_data["chatGroupId"])
                chatGroup.paper.add(paper)

                response["code"] = 200
                response["data"] = {
                    "msg" : "success"
                }
                return JsonResponse(response)
            except:
                response["code"] = 300
                response["data"] = {
                    "msg" : "database corrupted"
                }
                return JsonResponse(response)

    else:
        # 请用 post
        response["code"] = 600
        response["data"] = {
            "msg" : "incorrect request method"
        }
        return JsonResponse(response)
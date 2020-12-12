from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import sys
sys.path.append('..')
from user.models import User
from .models import *
from django.core import serializers
from django.forms.models import model_to_dict 
from commentarea.serializers import *
from .forms import *

# Create your views here.
@csrf_exempt
def get_comment_area(request):
    response = {}
    if request.method == 'GET':
        form = GetCommentAreaForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data['commentAreaId']
            print('hello')
            try:
                comment_area = CommentArea.objects.get(id = id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"comment area id does not exist"}
                return JsonResponse(response)
            serializer = CommentAreaSerializer(comment_area)
            #print(serializer.data)
            #print(model_to_dict(comment_area))
            response['code'] = 200
            response['data'] = {'msg':"success",'comment_area': serializer.data}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            print (form.errors)
            return JsonResponse(response)

@csrf_exempt
def rose_comment(request):
    response = {}
    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            user_id = form.cleaned_data['userId']
            #根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id = short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"short comment id does not exist"}
                return JsonResponse(response)
            #根据id获取点赞用户
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            #评论点赞数++，点赞用户列表填入点赞用户
            short_comment.rose_number = short_comment.rose_number + 1
            short_comment.rose_user_list.add(user)
            #更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)


@csrf_exempt
def egg_comment(request):
    response = {}
    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            user_id = form.cleaned_data['userId']
            #根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id = short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"short comment id does not exist"}
                return JsonResponse(response)
            #根据id获取点踩用户
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            #评论点踩数++，点踩用户列表填入点踩用户
            short_comment.egg_number = short_comment.egg_number + 1
            short_comment.egg_user_list.add(user)
            #更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def star_comment(request):
    response = {}
    if request.method == 'GET':
        form = OpLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            user_id = form.cleaned_data['userId']
            #根据id获取长评
            try:
                long_comment = LongComment.objects.get(id = long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"long comment id does not exist"}
                return JsonResponse(response)
            #根据id获取收藏用户
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            #评论点赞数++，点赞用户列表填入点赞用户
            long_comment.star_number = long_comment.star_number + 1
            long_comment.star_user_list.add(user)
            #更新数据库
            long_comment.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def star_comment_area(request):
    response = {}
    if request.method == 'GET':
        form = OpCommentAreaForm(request.GET)
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            user_id = form.cleaned_data['userId']
            #根据id获取讨论区
            try:
                comment_area = CommentArea.objects.get(id = comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"comment area id does not exist"}
                return JsonResponse(response)
            #根据id获取收藏的用户
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            #收藏用户列表加入收藏用户
            comment_area.star_user_list.add(user)
            #更新数据库
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def post_short_comment_for_long_comment(request):
    response = {}
    if request.method == 'POST':
        form = PostShortCommentForLongCommentForm(json.loads(request.body))
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            short_comment_content = form.cleaned_data['shortComment']
            user_id = form.cleaned_data['userId']
            try:
                long_comment = LongComment.objects.get(id = long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"long comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            short_comment = ShortComment(poster = user, content = short_comment_content)
            #必须要先save才能建立关联
            short_comment.save()
            #建立长评短评之间的关联
            long_comment.short_comment_list.add(short_comment)
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def request_create_comment_area(request):
    response = {}
    if request.method == 'POST':
        form = CreateCommentAreaForm(json.loads(request.body))
        if form.is_valid():
            #这里调试阶段先使用paper_info代替path，之后需要加上一个把paper_info 存储到静态文件目录中，
            #然后把对应的路径填到paper_path中
            user_id = form.cleaned_data["userId"]
            paper_info = form.cleaned_data["paperPdfInStr"]
            paper_title = form.cleaned_data["paperTitle"]
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            paper = Paper(title = paper_title, path = paper_info)
            paper.save()
            create_request = CreateRequest(requestor = user, paper = paper)
            create_request.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def approve_create_comment_area_request(request):
    response = {}
    if request.method == 'GET':
        form = ApproveCreateCommentAreaRequestForm(request.GET)
        if form.is_valid():
            request_id = form.cleaned_data['requestId']
            try:
                create_request = CreateRequest.objects.get(id = request_id)
            except CreateRequest.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"request id does not exist"}
                return JsonResponse(response)
            paper = create_request.paper
            requestor = create_request.requestor
            # 讨论区的名字就默认成论文的名字，版主默认为申请创建者
            comment_area = CommentArea(name = paper.title, master = requestor, paper = paper)
            # 创建者默认收藏
            comment_area.save()
            comment_area.star_user_list.add(requestor)
            comment_area.save()
            # 删除已经审批的请求
            create_request.delete()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_create_comment_area_request(request):
    response = {}
    #这里应该需要使用cookie判断权限
    response['code'] = 200
    serializer = CreateRequestSerializer(CreateRequest.objects.all(), many = True)
    response['data'] = {'msg':"success", "createRequestList": serializer.data}
    return JsonResponse(response)

@csrf_exempt
def get_star_comment_area_list(request):
    response = {}
    if request.method == 'GET':
        form = UserForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data['userId']
            try:
                user = User.objects.get(id = id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            response['code'] = 200
            serializer = CommentAreaSerializer(user.star_comment_area.all(), many = True)
            response['data'] = {'msg':"success", "commentAreaList": serializer.data}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def post_short_comment(request):
    response = {}
    if request.method == 'POST':
        form = PostShortCommentForm(json.loads(request.body))
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            content = form.cleaned_data['content']
            user_id = form.cleaned_data['userId']
            try:
                comment_area = CommentArea.objects.get(id = comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"comment area id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            short_comment = ShortComment(
                poster = user, 
                content = content
            )
            short_comment.save()
            #建立长评短评之间的关联
            comment_area.short_comment_list.add(short_comment)
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def post_long_comment(request):
    response = {}
    if request.method == 'POST':
        form = PostLongCommentForm(json.loads(request.body))
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            content = form.cleaned_data['content']
            title = form.cleaned_data['title']
            user_id = form.cleaned_data['userId']
            try:
                comment_area = CommentArea.objects.get(id = comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"comment area id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            long_comment = LongComment(poster = user, title = title, content = content)
            long_comment.save()
            #建立长评短评之间的关联
            comment_area.long_comment_list.add(long_comment)
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg':"success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_short_comment(request):
    response = {}
    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            user_id = form.cleaned_data['userId']
            try:
                short_comment = ShortComment.objects.get(id = short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"short comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            serializer = ShortCommentSerializer(short_comment)
            #查询是否赞过或者踩过
            rose = short_comment.rose_user_list.filter(id = user.id).exists()
            egg = short_comment.egg_user_list.filter(id = user.id).exists()
            response['code'] = 200
            response['data'] = {'msg':"success",'comment': serializer.data, "rose": rose, "egg": egg}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_long_comment(request):
    response = {}
    if request.method == 'GET':
        form = OpLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            user_id = form.cleaned_data['userId']
            try:
                long_comment = LongComment.objects.get(id = long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"long comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id = user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg':"user id does not exist"}
                return JsonResponse(response)
            serializer = LongCommentSerializer(long_comment)
            star = long_comment.star_user_list.filter(id = user.id).exists()
            response['code'] = 200
            response['data'] = {'msg':"success",'comment': serializer.data, "star": star}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg':form.errors}
            return JsonResponse(response)
        


from django.shortcuts import render
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import sys
from django.http import HttpResponse, Http404, FileResponse

sys.path.append('..')
from user.models import User
from .models import *
from django.core import serializers
from django.forms.models import model_to_dict
from commentarea.serializers import *
from .forms import *
from user.views import check_cookie
from pQper.settings import *


# Create your views here.
@csrf_exempt
def get_comment_area(request):
    response = {}
    if request.method == 'GET':

        user_id = check_cookie(request)
        if user_id == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        print(user_id)
        form = GetCommentAreaForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data['commentAreaId']
            try:
                comment_area = CommentArea.objects.get(id=id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "comment area id does not exist"}
                return JsonResponse(response)
            serializer = CommentAreaSerializer(comment_area)
            # print(serializer.data)
            # print(model_to_dict(comment_area))
            star = comment_area.star_user_list.filter(id=user_id).exists()
            data = serializer.data
            data['path'] = comment_area.paper.path
            data['star'] = star
            response['code'] = 200
            response['data'] = {'msg': "success", 'comment_area': data}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            print(form.errors)
            return JsonResponse(response)


@csrf_exempt
def rose_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            # user_id = form.cleaned_data['userId'] 现在使用cookie了
            # 根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id=short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "short comment id does not exist"}
                return JsonResponse(response)
            # 根据id获取点赞用户
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 评论点赞数++，点赞用户列表填入点赞用户
            short_comment.rose_number = short_comment.rose_number + 1
            short_comment.rose_user_list.add(user)
            # 更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def egg_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id=short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "short comment id does not exist"}
                return JsonResponse(response)
            # 根据id获取点踩用户
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 评论点踩数++，点踩用户列表填入点踩用户
            short_comment.egg_number = short_comment.egg_number + 1
            short_comment.egg_user_list.add(user)
            # 更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def star_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取长评
            try:
                long_comment = LongComment.objects.get(id=long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "long comment id does not exist"}
                return JsonResponse(response)
            # 根据id获取收藏用户
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 评论点赞数++，点赞用户列表填入点赞用户
            long_comment.star_number = long_comment.star_number + 1
            long_comment.star_user_list.add(user)
            # 更新数据库
            long_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def star_comment_area(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpCommentAreaForm(request.GET)
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取讨论区
            try:
                comment_area = CommentArea.objects.get(id=comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "comment area id does not exist"}
                return JsonResponse(response)
            # 根据id获取收藏的用户
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 收藏用户列表加入收藏用户
            comment_area.star_user_list.add(user)
            comment_area.star_number  = comment_area.star_number + 1
            # 更新数据库
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_paper(request):
    response = {}
    if request.method == 'GET':
        user_id = check_cookie(request)
        if user_id == -1:
            response['code'] = 300
            response['data'] = {'msg': "cookie out of date"}
            return JsonResponse(response)
        print(user_id)
        form = PaperIdForm(request.GET)
        if form.is_valid():
            id = form.cleaned_data['paperId']
            try:
                paper = Paper.objects.get(id=id)
            except Paper.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "paper id does not exist"}
                return JsonResponse(response)
            print(paper.path)
            #serializer = PaperSerializer(paper)
            #data = serializer.data
            print(MEDIA_ROOT + '/' + paper.path)
            try:
                response = FileResponse(open(MEDIA_ROOT + '/' + paper.path, 'rb'))
                response['content_type'] = "application/octet-stream"
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(paper.path)
                return response
            except Exception as e:
                print(e)
                raise Http404
            #response['code'] = 200
            #response['data'] = {'msg': "success", 'paper': data}
            #return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            print(form.errors)
            return JsonResponse(response)



@csrf_exempt
def post_short_comment_for_long_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'POST':
        form = PostShortCommentForLongCommentForm(json.loads(request.body))
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            short_comment_content = form.cleaned_data['shortComment']
            # user_id = form.cleaned_data['userId']
            try:
                long_comment = LongComment.objects.get(id=long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "long comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            short_comment = ShortComment(poster=user, content=short_comment_content)
            # 必须要先save才能建立关联
            short_comment.save()
            # 建立长评短评之间的关联
            long_comment.short_comment_list.add(short_comment)
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def request_create_comment_area(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'POST':
        # 注意这里paperform不是paper对应的form一个是Path一个是File 
        form = PaperForm(request.POST, request.FILES)
        if form.is_valid():
            paper_file = PaperFile(title = form.cleaned_data["title"],paper = request.FILES['paper'])
            paper_file.save()
            paper = Paper(title = paper_file.title, path = paper_file.paper.name)
            paper.save()
            user = User.objects.get(id = user_id)
            create_request = CreateRequest(requestor=user, paper=paper)
            create_request.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def approve_create_comment_area_request(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = ApproveCreateCommentAreaRequestForm(request.GET)
        if form.is_valid():
            request_id = form.cleaned_data['requestId']
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 判断是否有管理员权限
            if user.privilege == False:
                response['code'] = 300
                response['data'] = {'msg': "not administrator"}
                return JsonResponse(response)
            try:
                create_request = CreateRequest.objects.get(id=request_id)
            except CreateRequest.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "request id does not exist"}
                return JsonResponse(response)
            paper = create_request.paper
            requestor = create_request.requestor
            # 讨论区的名字就默认成论文的名字，版主默认为申请创建者
            comment_area = CommentArea(name=paper.title, master=requestor, paper=paper)
            # 创建者默认收藏
            comment_area.save()
            comment_area.star_user_list.add(requestor)
            comment_area.save()
            # 删除已经审批的请求
            create_request.delete()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)
@csrf_exempt
def reject_create_comment_area_request(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = ApproveCreateCommentAreaRequestForm(request.GET)
        if form.is_valid():
            request_id = form.cleaned_data['requestId']
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            # 判断是否有管理员权限
            if user.privilege == False:
                response['code'] = 300
                response['data'] = {'msg': "not administrator"}
                return JsonResponse(response)
            try:
                create_request = CreateRequest.objects.get(id=request_id)
            except CreateRequest.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "request id does not exist"}
                return JsonResponse(response)
            create_request.delete()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_create_comment_area_request(request):
    response = {}
    # 这里应该需要使用cookie判断权限

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    # print(user_id)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        response['code'] = 300
        response['data'] = {'msg': "user id does not exist"}
        return JsonResponse(response)
    # print(user.user_email, user.user_password, user.privilege)

    if user.privilege == False:
        response['code'] = 300
        response['data'] = {'msg': "not administrator"}
        return JsonResponse(response)

    response['code'] = 200
    serializer = CreateRequestSerializer(CreateRequest.objects.all(), many=True)
    response['data'] = {'msg': "success", "createRequestList": serializer.data}
    return JsonResponse(response)


@csrf_exempt
def get_star_comment_area_list(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'GET':
        # id = form.cleaned_data['userId']
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            response['code'] = 300
            response['data'] = {'msg': "user id does not exist"}
            return JsonResponse(response)
        response['code'] = 200
        #这里用的serializer和之前的不一样，只会发送id and name
        serializer = CommentAreaInListSerializer(user.star_comment_area.all(), many=True)
        response['data'] = {'msg': "success", "commentAreaList": serializer.data}
        return JsonResponse(response)


@csrf_exempt
def post_short_comment(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'POST':
        form = PostShortCommentForm(json.loads(request.body))
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            content = form.cleaned_data['content']
            # user_id = form.cleaned_data['userId']
            try:
                comment_area = CommentArea.objects.get(id=comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "comment area id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            short_comment = ShortComment(
                poster=user,
                content=content
            )
            short_comment.save()
            # 建立长评短评之间的关联
            comment_area.short_comment_list.add(short_comment)
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def post_long_comment(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'POST':
        form = PostLongCommentForm(json.loads(request.body))
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            content = form.cleaned_data['content']
            title = form.cleaned_data['title']
            # user_id = form.cleaned_data['userId']
            try:
                comment_area = CommentArea.objects.get(id=comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "comment area id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            long_comment = LongComment(poster=user, title=title, content=content)
            long_comment.save()
            # 建立长评短评之间的关联
            comment_area.long_comment_list.add(long_comment)
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def get_short_comment(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            # user_id = form.cleaned_data['userId']
            try:
                short_comment = ShortComment.objects.get(id=short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "short comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            serializer = ShortCommentSerializer(short_comment)
            # 查询是否赞过或者踩过
            rose = short_comment.rose_user_list.filter(id=user.id).exists()
            egg = short_comment.egg_user_list.filter(id=user.id).exists()
            data = serializer.data
            data['egg'] = egg
            data['rose'] = rose
            response['code'] = 200
            response['data'] = {'msg': "success", 'comment': data}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)


@csrf_exempt
def get_long_comment(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'GET':
        form = GetLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            in_comment_area = form.cleaned_data['inCommentArea']
            # user_id = form.cleaned_data['userId']
            try:
                long_comment = LongComment.objects.get(id=long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "long comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            if in_comment_area:
                serializer = LongCommentInCommentAreaSerializer(long_comment)
            else:
                serializer = LongCommentSerializer(long_comment)
            star = long_comment.star_user_list.filter(id=user_id).exists()
            data = serializer.data
            data['star'] = star
            #判断当前用户是否发布了该评论
            data['create'] = (user_id == long_comment.poster.id)
            if in_comment_area:
                data['content'] = long_comment.content[:50]
            response['code'] = 200
            response['data'] = {'msg': "success", 'comment': data}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def delete_long_comment(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'GET':
        form = OpLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            # user_id = form.cleaned_data['userId']
            try:
                long_comment = LongComment.objects.get(id=long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "long comment id does not exist"}
                return JsonResponse(response)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "user id does not exist"}
                return JsonResponse(response)
            if long_comment.poster.id == user_id:
                long_comment.delete()
                response['code'] = 200
                response['data'] = {'msg': "success"}
                return JsonResponse(response)
            else:
                response['code'] = 300
                response['data'] = {'msg': "you can't delete others' comment"}
                return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def get_star_long_comment_list(request):
    response = {}
    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            response['code'] = 300
            response['data'] = {'msg': "user id does not exist"}
            return JsonResponse(response)
        response['code'] = 200
        serializer = LongCommentInListSerializer(user.star_long_comment.all(), many=True)
        response['data'] = {'msg': "success", "longCommentList": serializer.data}
        return JsonResponse(response)

@csrf_exempt
def cancel_star_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpLongCommentForm(request.GET)
        if form.is_valid():
            long_comment_id = form.cleaned_data['longCommentId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取长评
            try:
                long_comment = LongComment.objects.get(id=long_comment_id)
            except LongComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "long comment id does not exist"}
                return JsonResponse(response)
            # 查询是否已经收藏
            star = long_comment.star_user_list.filter(id=user_id).exists()
            if not star:
                response['code'] = 300
                response['data'] = {'msg': "you have not starred this comment"}
                return JsonResponse(response)
            long_comment.star_number = long_comment.star_number - 1
            long_comment.star_user_list.remove(user_id)
            # 更新数据库
            long_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def cancel_egg_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id=short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "short comment id does not exist"}
                return JsonResponse(response)
            # 查询是否已经点踩
            egg = short_comment.egg_user_list.filter(id=user_id).exists()
            if not egg:
                response['code'] = 300
                response['data'] = {'msg': "you have not egged this comment"}
                return JsonResponse(response)

            short_comment.egg_number = short_comment.egg_number - 1
            short_comment.egg_user_list.remove(user_id)
            # 更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)

@csrf_exempt
def cancel_rose_comment(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpShortCommentForm(request.GET)
        if form.is_valid():
            short_comment_id = form.cleaned_data['shortCommentId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取短评
            try:
                short_comment = ShortComment.objects.get(id=short_comment_id)
            except ShortComment.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "short comment id does not exist"}
                return JsonResponse(response)
            # 查询是否已经点赞
            rose = short_comment.rose_user_list.filter(id=user_id).exists()
            if not rose:
                response['code'] = 300
                response['data'] = {'msg': "you have not rosed this comment"}
                return JsonResponse(response)

            short_comment.rose_number = short_comment.rose_number - 1
            short_comment.rose_user_list.remove(user_id)
            # 更新数据库
            short_comment.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)
@csrf_exempt
def cancel_star_comment_area(request):
    response = {}

    user_id = check_cookie(request)
    if user_id == -1:
        response['code'] = 300
        response['data'] = {'msg': "cookie out of date"}
        return JsonResponse(response)

    if request.method == 'GET':
        form = OpCommentAreaForm(request.GET)
        if form.is_valid():
            comment_area_id = form.cleaned_data['commentAreaId']
            # user_id = form.cleaned_data['userId']
            # 根据id获取讨论区
            try:
                comment_area = CommentArea.objects.get(id=comment_area_id)
            except CommentArea.DoesNotExist:
                response['code'] = 300
                response['data'] = {'msg': "comment area id does not exist"}
                return JsonResponse(response)
            star = comment_area.star_user_list.filter(id=user_id).exists()
            if not star:
                response['code'] = 300
                response['data'] = {'msg': "you have not starred this comment area"}
                return JsonResponse(response)
            comment_area.star_user_list.remove(user_id)
            comment_area.star_number  = comment_area.star_number - 1
            # 更新数据库
            comment_area.save()
            response['code'] = 200
            response['data'] = {'msg': "success"}
            return JsonResponse(response)
        else:
            response['code'] = 300
            response['data'] = {'msg': form.errors}
            return JsonResponse(response)
# 拒绝创建讨论区

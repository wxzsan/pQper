from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from user.models import User
from commentarea.models import Paper, ShortComment
import requests
import json

from haystack.query import SearchQuerySet
from user.views import check_cookie
from datetime import datetime


# 搜索引擎功能
# 根据输入的内容
# 会返回可能的 用户的用户名、论文的论文名 用于填入待选框
@csrf_exempt
def SearchForPapersAndUsers(request):
    if request.method == 'GET':
        try :
            response = {
                'code' : 200,
                'msg' : "search success",
                'data' : {
                    'findCommentAreas' : [],
                    'findUsers' : []
                }
            }
            searchString = request.GET.get('searchString')

            # 查找相关的论文
            # 使用全文索引获得可能的paper的id
            paper_ids = list(
                SearchQuerySet().
                filter(content=searchString).
                values("pk"))

            # 根据 paper_id 获得paper 的 id, title, path, commentareaid
            for paper_id in paper_ids:
                p = Paper.objects.get(id=paper_id['pk'])
                paper_data = dict()
                paper_data["id"] = p.id
                paper_data["title"] = p.title
                paper_data["path"] = p.path
                tmp_list = list(p.commentarea_set.values("id"))
                if tmp_list:
                    paper_data["commentareaid"] = tmp_list[0]['id']
                    response['data']['findCommentAreas'].append(paper_data)

            # 查找相关的用户
            # 直接全字匹配
            response['data']['findUsers'] = list(
                User.objects.
                filter(user_name=searchString).
                values("id", "user_name"))
            return JsonResponse(response)
        except:
            # 多半是数据库挂了
            return JsonResponse({{"code" : 300}, {"msg", "db corrupted"}})
    else:
        # 请用 GET
        return JsonResponse({ {"code" : 600}, {"msg" : "incorrect request method"}})
        

# 获取动态
@csrf_exempt
def GetMomments(request):
    response = {}
    if request.method == 'POST':
        # print(request.body)
        # 不使用 cookie 测试的话，就将 debugflag = TRUE
        debugflag = True
        if debugflag == False:
            # 根据 cookie 判断能否查看动态
            userid = check_cookie(request)
            if userid == -1:
                response['code'] = 300
                response['data'] = {'msg': 'cookie out of date'}
                return JsonResponse(response)
        else:
            userid = json.loads(request.body)['userid']
        
        # 请传送时间戳
        start_time = datetime.fromtimestamp(int(json.loads(request.body)['time']))
        user = User.objects.get(id=userid)

        try:
            # 获取关注了的人的id
            # userlist = [{"id" : ...}, ....]
            userlist = list(user.staruserlist_set.values('user_id'))
            # 包括他自己
            userlist.append({'user_id' : user.id})

            # 根据关注了的人的 id 进行检索，找到 start_time 之后提交的长评
            friends_long_comment_list = []
            for friends in userlist:
                friends_id = friends['user_id']
                friends_recent_long_comment = list(
                    User.objects.get(id=friends_id).
                    post_long_comment.
                    filter(post_time__gte = start_time).
                    values("id", "title", "content", "post_time", "poster")
                    ) 

                friend_name = User.objects.get(id=friends_id).user_name
                for i in friends_recent_long_comment:
                    i['poster_name'] = friend_name
                friends_long_comment_list.extend(friends_recent_long_comment)

                friends_long_comment_list.sort(key= lambda x : x["post_time"])

            response['code'] = 200
            response['data'] = {
                'msg': "success",
                'LongComments': friends_long_comment_list
                }
            return JsonResponse(response)

        except:
            # 多半是数据库挂了
            return JsonResponse({{"code" : 300}, {"msg", "db corrupted"}})

    else:
        # 请用 POST
        return JsonResponse({"code" : 600})

# 获得个人的所有动态
@csrf_exempt
def GetSelfMomments(request):
    response = {}
    if request.method == 'POST':
        # 不使用 cookie 测试的话，就将 debugflag = TRUE
        debugflag = True
        if debugflag == False:
            # 根据 cookie 判断能否查看动态
            userid = check_cookie(request)
            if userid == -1:
                response['code'] = 300
                response['data'] = {'msg': 'cookie out of date'}
                return JsonResponse(response)
        else:
            userid = json.loads(request.body)['userid']
        

        try:
            user = User.objects.get(id=userid)
            long_comment_list = list(user.post_long_comment.values("id", "title", "content", "post_time"))
            long_comment_list.sort(key=lambda x : x["post_time"])

            response['code'] = 200
            response['data'] = {
                'msg': "success",
                'LongComments': long_comment_list
                }
            return JsonResponse(response)

        except:
            # 多半是数据库挂了
            return JsonResponse({{"code" : 300}, {"msg", "db corrupted"}})

    else:
        # 请用 POST
        return JsonResponse({"code" : 600})
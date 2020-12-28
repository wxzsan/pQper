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
        print("1******")
        form = AddAnnotationForm(json.loads(request.body))
        print("3******")
        if form.is_valid():
            x = form.cleaned_data['x']
            y = form.cleaned_data['y']
            print("4******")
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
            print(doc.metadata['encryption'])
            page = doc.loadPage(page_num)
            top_left = (x, y)
            #添加批注
            annot = page.addTextAnnot(top_left, content)
            print(doc.metadata['encryption'])
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
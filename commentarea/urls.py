from django.urls import path
from . import views
from django.views.generic.base import TemplateView

urlpatterns = {
    path('get_comment_area', views.get_comment_area),
    path('rose_comment', views.rose_comment),
    path('egg_comment', views.egg_comment),
    path('star_comment', views.star_comment),
    path('star_comment_area', views.star_comment_area),
    path('post_short_comment_for_long_comment', views.post_short_comment_for_long_comment),
    path('request_create_comment_area', views.request_create_comment_area),
    path('approve_create_comment_area_request', views.approve_create_comment_area_request),
    path('get_create_comment_area_request', views.get_create_comment_area_request),
    path('get_star_comment_area_list', views.get_star_comment_area_list),
    path('post_long_comment', views.post_long_comment),
    path('get_short_comment', views.get_short_comment),
    path('get_long_comment', views.get_long_comment),
    path('post_short_comment', views.post_short_comment),
    path('get_star_long_comment_list', views.get_star_long_comment_list),
    path('delete_long_comment', views.delete_long_comment),
    path('cancel_egg_comment', views.cancel_egg_comment),
    path('cancel_star_comment',views.cancel_star_comment),
    path('cancel_rose_comment', views.cancel_rose_comment),
    path('cancel_star_comment_area', views.cancel_star_comment_area),
    path('approveCreateCommentArea.html', TemplateView.as_view(template_name = 'approveCreateCommentArea.html')),
    path('commentArea.html', TemplateView.as_view(template_name = 'commentArea.html')),
    path('longComment.html', TemplateView.as_view(template_name = 'longComment.html')),
    path('manageComment.html', TemplateView.as_view(template_name = 'manageComment.html')),
    path('requestCreateCommentArea.html', TemplateView.as_view(template_name = 'requestCreateCommentArea.html')),
    path('myCommentAreaList.html', TemplateView.as_view(template_name = 'myCommentAreaList.html')),
    path('starCommentList.html', TemplateView.as_view(template_name = 'starCommentList.html')),
    path('get_paper', views.get_paper),
}
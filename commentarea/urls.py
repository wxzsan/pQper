from django.urls import path
from . import views

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
}
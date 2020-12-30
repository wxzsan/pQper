from django.urls import path
from . import views
from django.views.generic.base import TemplateView

urlpatterns = {
    path('add_annotation', views.add_annotation),
    path('getChatGroupPapers', views.getChatGroupPapers),
    path('getChatGroupMembers', views.getChatGroupMembers),
    path('createChatGroup', views.createChatGroup),
    path('uploadChatGroupPaper', views.uploadChatGroupPaper),
    path('chatGroupPaper.html', TemplateView.as_view(template_name = 'chatGroupPaper.html')),
    path('showpdf.html', TemplateView.as_view(template_name = 'showpdf.html')),
    path('memberInGroupPage.html', TemplateView.as_view(template_name = 'memberInGroupPage.html')),
    path('singleGroupPage.html', TemplateView.as_view(template_name = 'singleGroupPage.html')),
    path('uploadPaperToChatGroup.html', TemplateView.as_view(template_name = 'uploadPaperToChatGroup.html')),
    path('getChatGroupName', views.getChatGroupName),
    path('myChatGroupList.html', TemplateView.as_view(template_name = 'myChatGroupList.html')),
    path('createChatGroup.html', TemplateView.as_view(template_name = 'createChatGroup.html')),
}
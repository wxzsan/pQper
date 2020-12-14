from django.urls import path
from . import views

urlpatterns = {
    path('Creat_StarPaperListPage', views.Creat_StarPaperListPage),
    path('Creat_StarCommentListPage', views.Creat_StarCommentListPage),
    path('Creat_StarUserListPage', views.Creat_StarUserListPage),
    path('Creat_MyCommentAreaListPage', views.Creat_MyCommentAreaListPage),
    path('StarPaperListPage', views.StarPaperListPage),
    path('StarCommentListPage', views.StarCommentListPage),
    path('StarUserListPage', views.StarUserListPage),
    path('MyCommentAreaListPage', views.MyCommentAreaListPage),
#    path('StarPaperListPage.html', TemplateView.as_view(template_name='StarPaperListPage.html')),
#    path('StarCommentListPage.html', TemplateView.as_view(template_name='StarCommentListPage.html')),
#    path('StarUserListPage.html', TemplateView.as_view(template_name='StarUserListPage.html')),
#    path('MyCommentAreaListPage.html', TemplateView.as_view(template_name='MyCommentAreaListPage.html'))
}

from django.urls import path
from . import views
from django.views.generic.base import TemplateView

urlpatterns = {
    path('SearchForPapersAndUsers', views.SearchForPapersAndUsers),
    path('Momments', views.GetMomments),
    path('SelfMomments', views.GetSelfMomments),
    path('HomePage.html', TemplateView.as_view(template_name = 'HomePage.html')),
    path('SearchResultPage.html', TemplateView.as_view(template_name = 'SearchResultPage.html')),
    path('UserProfilePage.html', TemplateView.as_view(template_name = 'UserProfilePage.html'))
}
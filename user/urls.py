from django.urls import path
from . import views
from django.views.generic.base import TemplateView

urlpatterns = [
    path('login', views.login),
    path('register', views.register),
    path('register.html', TemplateView.as_view(template_name = 'register.html')),
    path('login.html', TemplateView.as_view(template_name = 'login.html'))
]
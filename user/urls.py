from django.urls import path
from . import views

urlpatterns = {
    path('adduser', views.adduser),
}
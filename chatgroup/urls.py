from django.urls import path
from . import views
from django.views.generic.base import TemplateView

urlpatterns = {
    path('add_annotation', views.add_annotation),
}
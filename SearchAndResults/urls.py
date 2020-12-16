
from django.urls import path
from . import views

urlpatterns = {
    path('SearchForPapersAndUsers', views.SearchForPapersAndUsers),
    path('Momments', views.GetMomments),
    path('SelfMomments', views.GetSelfMomments),
}
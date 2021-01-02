"""pQper URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include,re_path
import commentarea.urls
import user.urls
import SearchAndResults.urls
import chatgroup.urls
from django.views.static import serve
from .settings import MEDIA_URL,MEDIA_ROOT
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic.base import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include(user.urls)),
    path('commentarea/', include(commentarea.urls)),
    path('SearchAndResults/', include(SearchAndResults.urls)),
    path('chatgroup/', include(chatgroup.urls)),
    path('', TemplateView.as_view(template_name = 'login.html'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

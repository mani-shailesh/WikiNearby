"""
C{map_annotate} URL Configuration
"""
from django.urls import re_path
from django.contrib import admin

from map_annotate_app import views

urlpatterns = [
    re_path(r'^admin/', admin.site.urls, name='admin'),
    re_path(r'^api/', views.get_response),
    re_path(r'^.*$', views.index, name='index'),
]

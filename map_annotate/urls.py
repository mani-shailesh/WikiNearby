"""
C{map_annotate} URL Configuration
"""
from django.conf.urls import url
from django.contrib import admin

from map_annotate_app import views

urlpatterns = [
    url(r'^admin/', admin.site.urls, name='admin'),
    url(r'^api/', views.get_response),
    url(r'^.*$', views.index, name='index'),
]

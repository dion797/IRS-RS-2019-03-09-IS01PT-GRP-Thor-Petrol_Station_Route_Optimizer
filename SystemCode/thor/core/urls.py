from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^amm$', views.amm, name='amm'),
    url(r'^api/route$', views.newRoute, name='newRoute'),
    url(r'^b/$', views.b, name='b'),
    url(r'^api/petrol', views.petrol, name='petrol'),
]

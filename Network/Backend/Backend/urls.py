"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from django.conf.urls.static import static 
from django.conf import settings
from User import views as us
from Post import views as ps
from Comment import views as cs

urlpatterns = [
   path('admin/', admin.site.urls),
    path('',us.home,name="home"),
    path('register/',us.register,name="register"),
    path('login/',us.login,name="login"),
    path('user/update/', us.update_user, name='update_user'),
    path("user/post/<int:id>/like", ps.like_post, name="likepost"),
    path("user/post/<int:id>/unlike", ps.unlike_post, name="unlikepost"),
    path("user/post/<int:id>/save", ps.save_post, name="savepost"),
    path("user/post/<int:id>/unsave", ps.unsave_post, name="unsavepost"),
    path('user/createpost/',ps.create_post,name="create_post"),
    path("user/post/<int:id>/delete/", ps.delete_post, name="deletepost"),
    path("user/post/<int:id>/write_comment",cs.comment, name="writecomment"),
    path("user/post/<int:id>/update",ps.update_post, name="updatepost"),
    path('user/verify/',us.verify_otp,name="email_verified"),
    path('user/changepassword/',us.change_password,name="change_password"),
    path('reset_send_mail/',us.reset_send_mail),
    path('user/resend_mail/',us.resend_mail),
    path('reset_password/<str:token>/',us.reset_password),
    path('allpost/',ps.allPost),
    path('savepost/',ps.saved_post),
    path('user/profile',us.profile_data)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
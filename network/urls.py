
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("network", views.new_post, name="new_post"),
    path("posts", views.get_posts, name="get_posts"),
    path("posts/<int:user_id>", views.get_posts, name="get_posts"),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("is_following/<int:user_id>", views.is_following, name="profis_followingile"),
    path("get_following_posts", views.get_following_posts, name="get_following_posts"),
    path("add_remove_follower/<int:user_id>", views.add_remove_follower, name="add_remove_follower"),
    
    
]

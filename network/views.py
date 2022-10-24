import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .models import Following, Post, User, Like


def index(request):
    
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "network/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def new_post(request):
    # new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # get the content of the new post
    data = json.loads(request.body) 
    text = data.get("text", "")
    
    # save post in db
    post = Post(
        user=request.user,
        text=text
    )
    post.save()

    return JsonResponse({"message": "Post added successfully.", "post":post.serialize()}, status=201, safe=False)


def get_posts(request, user_id='null'):
    '''get all posts from all users'''
    if user_id != 'null':
        #get user's posts from db
        posts = Post.objects.filter(user_id=user_id)
                
    else:
        #get all posts from db
        posts = Post.objects.all()
    # Return posts in reverse chronologial order
    posts = posts.order_by("-timestamp").all()
    
    return JsonResponse([post.serialize() for post in posts], safe=False)


def profile(request, user_id):
    '''get user's following, followers'''

    user = User.objects.get(pk=user_id)
    followingCount = Following.objects.filter(user_id=user_id).count()
    followerCount =  Following.objects.filter(follow_id=user_id).count()
    
    return JsonResponse({
        "user": user.serialize(),
        "followerCount":followerCount, 
        "followingCount": followingCount
        },
        safe=False)


def is_following(request, user_id):
    ''' function to check if user is following another'''

    try:
        Following.objects.get(follow_id=user_id,user_id=request.user.id)
    except Following.DoesNotExist:
        return JsonResponse({"message": "not a follower."}, status=200)

    return JsonResponse({"message": "allready a follower."}, status=200)
        

@login_required      
def get_following_posts(request):

    '''function gets followings's posts'''

    # get user's followeing ids
    followings = Following.objects.filter(user_id=request.user.id).values_list('follow_id', flat=True)

    # followings posts
    posts = Post.objects.filter(user_id__in=followings).order_by("-timestamp")

    return JsonResponse([post.serialize() for post in posts], safe=False)
    


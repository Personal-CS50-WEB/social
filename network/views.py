import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Following, Post, User


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

    # if user looks at one user posts
    if user_id != 'null':
        #get user's posts from db
        posts = Post.objects.filter(user_id=user_id)
                
    else:
        #get all posts from db
        posts = Post.objects.all()
    # Return posts in reverse chronologial order
    posts = posts.order_by("-timestamp").all()

    return paginate(request, posts)


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

    return paginate(request, posts)
    

def paginate(request, posts):
    
    paginator = Paginator(posts, 10, orphans=1)

    # get page number
    page_number = request.GET.get('page')
    try:
        page_obj = paginator.get_page(page_number)
    except PageNotAnInteger:
        # if page is not an integer, deliver the first page
        page_obj = paginator.page(1)
    except EmptyPage:
        # if the page is out of range, deliver the last page
        page_obj = paginator.page(paginator.num_pages)
    
    # get the previous page
    try:
        previous_page_number = page_obj.previous_page_number()
    except EmptyPage:
        previous_page_number = 1

    # get next page
    try:
        next_page_number = page_obj.next_page_number()
    except EmptyPage:
        next_page_number = paginator.num_pages
    
    # get the posts as json data
    allposts = [post.serialize() for post in page_obj.object_list] 
    payload = {
        "page": {
            "current": page_obj.number,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "numberOfPages": page_obj.paginator.num_pages,
            "next_page_number": next_page_number,
            "previous_page_number": previous_page_number
        },
        "allposts": allposts
    }
    return JsonResponse(payload,  safe=False)


@csrf_exempt
@login_required
def add_remove_follower(request, user_id):
    '''function adds/removes new/a follower in db'''

    # must add follower by post request
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # if user is a follower : unfollow 
    if Following.objects.filter(user=request.user, follow_id=user_id).exists():
        Following.objects.get(user=request.user, follow_id=user_id).delete()
        return JsonResponse({"message": "User no longer a follower."}, status=201)

    # if user is not a follower : follow
    else:
        new = Following(user=request.user, follow_id=user_id)
        new.save()
        return JsonResponse({"message": "User has new following."}, status=201)


@csrf_exempt
@login_required
def like(request, post_id):
    '''function allows users to like/unlike posts'''

    post = Post.objects.get(pk=post_id)
    # when user like a post
    if request.method == "POST":
        post.likes.add(request.user)
        return JsonResponse({"message": "User liked this post.", "likes": post.likes.count()}, status=201)
       
    # when user unlike a post
    elif request.method == "DELETE":
        post.likes.remove(request.user)
        return JsonResponse({"message": "User unliked this post.", "likes": post.likes.count()}, status=201)
    else:
        return JsonResponse({"error": "Not a valid request."}, status=400)


@csrf_exempt
@login_required
def edit_post(request, post_id):
    ''' function allows users to edit thier posts'''

    # assert that only post owner can edit post
    post = Post.objects.get(pk=post_id)
    if post.user_id != request.user.id:
        return JsonResponse({"error": "Not a valid request."}, status=403)
    # must edit post by put request
    if request.method == "PUT":
        data = json.loads(request.body)
        if data.get("text") is not None:
                post.text = data["text"]              
                post.save()

        return JsonResponse({"post": post.serialize()}, status=204)

    # if  request is not put
    return JsonResponse({"error": "PUT request required."}, status=400)

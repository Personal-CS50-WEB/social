from email.policy import default
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
        }


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    text = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "userId": self.user.id,
            "text": self.text,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes,
        }
    def __str__(self):
        return f"{self.id}"


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id}"


class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="users")
    follow = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")

    def serialize(self):
        return {
            "userid": self.user.id,
            "username":  self.user.username,
            "followingid": self.follow.id,
            "followingname": self.follow.username,
        }

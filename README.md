# social
## Description:

 ```
A django single app  Twitter-like social network website for making posts, view/edit posts, like/unlike posts, and following users.
```

## Explaining the project:
It is a single page application that allows user to register or sign in, once a user is authenticated a page contanting all posts from all users will display with new post section that allows users to write new posts.
when users click on different links, different Apis will be called to display the required data such as profile page for a user with information about number of followers the user has, as well as the number of people that the user follows and display all of the posts for that user, in reverse chronological order.
the user who is authenticated could like/unlike any other post, see his followings posts and edit his own posts by calling specific api for each action.

## Technologies used:

#### Django framwork:

- Python
- html
- Css
- javascript
- django models
- sqlite3

**The project consists of:**:
#### **Database layer**:
 using django models(models.py) this project has three models:
 - user model : contains user information like id, username, password, email.
 - post model: contains post information like id,user who wrote the post, the text that post contains, users who liked this post, time created, time edited.
 - follow model : contains information about every user and his followings.

### **Business Layer:**
- view.py file: containts the Api used to get/delete/update information from models.py file.
- urls.py file : containts the routes and apis paths.

### **UI:**
 ### **html files** : 
 contains the layout for the webpage, login/register form and the single page in this project.
 ### **static files:**
 - style.css: for the page style.
 - javascript files:
 
   1. index.js: contains functions that toggle  between dispaly or hide views depending on users actions.
   
   2. handle_posts.js: contains functions that calls makes fetch request to the back end to get posts and display each post in element and dispay every 10 posts in a seperate pages.
   
   3. features.js : contains functions that calls the required api for every feature such as edit post, follow/unfollow users and like/unlike posts.


## How to launch application

1. pip3 freeze > requirements.txt
2. Clone the code : https://github.com/Personal-CS50-WEB/social.git
3. In terminal, python manage.py makemigrations network to make migrations for the network app.
4. python manage.py migrate
5. python manage.py runserver

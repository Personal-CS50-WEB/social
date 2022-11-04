# Social
## Description:

 A django single app Twitter-like social network website for making posts, view/edit, like/unlike posts, and following users.

## Explaining the project:
- It is a single page application that allows user to register or sign in, once a user is authenticated a page contanting all posts from all users will display with new post section that allows users to write new posts.
- when users click on different links, different APIs will be called to display the required data such as profile page for a user with information about number of followers the user has, as well as the number of people that the user follows and display all of the posts for that user, in reverse chronological order.
- the user who is authenticated could like/unlike any other post, see his followings posts and edit his own posts by calling specific API for each action.

## Technologies used:

#### Django framwork:

- Python
- Html
- Css
- Javascript
- Django models
- Sqlite3

**The project consists of:**
#### **Database layer**:
 Using django models(models.py) this project has three models:
 - User model : Contains user information like id, username, password, email.
 - Post model: Contains post information like id,user who wrote the post, the text that post contains, users who liked this post, time created, time edited.
 - Follow model : Contains information about every user and his followings.

### **Business Layer:**
- view.py file: Containts the Api used to get/delete/update information from models.py file.
- urls.py file : Containts the routes and apis paths.

### **UI:**
 ### **Html files** : 
 Contains the layout for the webpage, login/register form and the single page in this project.
 ### **Static files:**
 - Style.css: For the page style.
 - Javascript files:
 
   1. index.js: Contains functions that toggle  between dispaly or hide views depending on users actions.
   
   2. handle_posts.js: Contains functions that calls makes fetch request to the back end to get posts and display each post in element and dispay every 10 posts in a seperate pages.
   
   3. features.js : Contains functions that calls the required API for every feature such as edit post, follow/unfollow users and like/unlike posts.


## How to launch application

1. pip3 freeze > requirements.txt
2. Clone the code : https://github.com/Personal-CS50-WEB/social.git
3. In terminal, python manage.py makemigrations network to make migrations for the network app.
4. python manage.py migrate
5. python manage.py runserver

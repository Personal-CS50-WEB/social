# Social
## Description:

 A Django single app Twitter-like social network website for making posts, viewing/editing, liking/unliking posts, and following users.

## Explaining the project:
- It is a single-page application that allows users to register or sign in. Once a user has authenticated, a page containing all posts from all users will display with new post section that allows users to write new posts.
- When users click on different links, different APIs will be called to display the required data such as a profile page for a user with information about the number of followers the user has, as well as the number of people that the user follows and display all of the posts for that user, in reverse chronological order.
- The user who is authenticated could like/unlike any other post, see his followings posts and edit his posts by calling a specific API for each action.

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
 Using Django models(models.py), this project has three models:
 - User model: Contains user information like id, username, password, and email.
 - Post model: Contains post information like id, the user who wrote the post, the text the post contains, users who liked this post, time created, and time edited.
 - Follow model: Contains information about every user and his followings.

### **Business Layer:**
- view.py file: Contains the API used to get/delete/update information from the models.py file.
- urls.py file: Contains the routes and APIs paths.

### **UI:**
 ### **Html files** : 
 Contains the layout for the webpage, login/register form, and the single page in this project.
 ### **Static files:**
 - Style.css: For the page style.
 - Javascript files:
 
   1. index.js: Contains functions that toggle between display or hide views depending on users' actions.
   
   2. handle_posts.js: Contains functions that make fetch requests to the back-end to get posts and display each post in an element and display every ten posts on a separate page.
   
   3. features.js: Contains functions that call the required API for every feature, such as edit posts, follow/unfollow users, and like/unlike posts.


## How to launch the application

1. Clone the code: https://github.com/Personal-CS50-WEB/social.git
2. pip install -r requirements.txt
3. In the terminal, python manage.py makemigrations network to make migrations for the network app.
4. python manage.py migrate
5. python manage.py runserver

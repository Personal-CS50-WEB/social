document.addEventListener('DOMContentLoaded', function() {
    
    const userid =  document.querySelector('#userId').value;
    // when user click on any link on nav bar
    document.querySelector('#new-post-form').onsubmit = submit_post;
    document.querySelector('#allPosts').onclick = all_posts;
    document.querySelector('#userFollowing').onclick = function(){
        load_following();
        return false;
    };
    document.querySelector('#username').onclick = function(){
        profile_page(userid);
        return false;
    };
    
    // By default, load all
    all_posts();
});

function submit_post(){
    
    var body = document.querySelector('#text').value;
    if (document.querySelector('#submit').value  === "Edit")
    {
        var id = document.querySelector('#PostId').value;
        fetch(`/edit_post/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                text: body
             })
        })
        .then(console.log("post edited"));
    }
    
    else {
        // call api to submit new entry
        fetch('/network', {
            method: 'POST',
            body: JSON.stringify({
            text: body
            })
        })
        .then(response => response.json())
        .then(result => {
        
            // check if error 
            if ("error" in result) {
            alert(result['error']);
            console.log(result);
            
            }
            else {
            // add new post (first) to posts
            console.log(result);
            var element = add_post_to_div(result.post);
            // if first post
            if (document.querySelector("#all-posts").textContent.trim() === '')  {
            
                document.querySelector('#all-posts').append(element);  
            }    
            // if not first post: new post should dispaly first
            else {
                document.querySelector(".new-card").parentNode.insertBefore(element, document.querySelector(".new-card"));
            }
            // reset the text area 
            document.querySelector('#text').value = ""; 
            }  
        
        })
        .catch(error => {
            console.log('Error:', error);
        });

    }
        all_posts();
        // Prevent default submission 
        return false;
    }

function all_posts(num=1) {
    // display all posts and new post form 
    document.querySelector('#new-post').style.display = 'block';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#all-posts').innerHTML = '';
    document.querySelector('#page-number').innerHTML = '';

    // Clear out composition fields
    let new_text = document.querySelector('#text');
    const submit = document.querySelector('#submit');
    new_text.value = '';
    submit.disabled = true;
    // Listen for input to be typed into the input field
    new_text.onkeyup = () => {
        if (new_text.value.length > 0) {
            submit.disabled = false;
        }
        else {
            submit.disabled = true;
        }
    }
    // call api to get posts
    fetch_posts ('allposts', num)
    return false;
}

function load_following(num=1) {
   
    // dispaly only posts view.
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#all-posts').innerHTML = '';
    // call fetch posts function to get followings posts
    fetch_posts('userFollowing', num);
    return false;
}

function add_post_to_div(post){
    // create new div for a post
    const element = document.createElement('div');
    element.classList.add('card', 'new-card');
    element.innerHTML = `<div class="card-body">
        <h5 class="btn btn-outline-info" onclick="profile_page(${post.userId});"><strong>${post.user}</strong></h5>
        <p id="post${post.id}"class="card-text">${post.text}</p>
        </div>
        <footer class="blockquote-footer">${post.timestamp}</footer>
        `;
        // if user if the post owner : add edit button 
        if(`${post.userId}`== document.querySelector('#userId').value) {
            var newElement = document.createElement('div');
            newElement.innerHTML = `
            <span><button onclick="edit_post('${post.text}', ${post.id});"class="btn btn-link">Edit</button></span>
            `;
            element.appendChild(newElement);
        }
        // if user allready like this post : button appears red otherwise button appears in defult color
        if (post.likes.indexOf(parseInt(document.querySelector('#userId').value)) >= 0) {
            var newElement = document.createElement('div');
            newElement.innerHTML = `
            <div class="card-footer text-muted">
            <button id="${post.id}" onclick="like_post(this.id,'delete_like');"class="btn btn-outline-danger">
            ❤️
            ${post.likes.length} Likes</button>
            </div>`;
            element.appendChild(newElement);    
        }
        else { 
            var newElement = document.createElement('div');
            newElement.innerHTML = `
            <div class="card-footer text-muted">
            <button id="${post.id}" onclick="like_post(this.id, 'add_like');"class="btn btn-outline-danger">
            🤍<span class="text-info"> ${post.likes.length} Likes</span></button>
            </div>`;
            element.appendChild(newElement);
        }
        return element;
}

function profile_page(id, num=1) {

    // display only profile information and posts.
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'block';
    document.querySelector('#all-posts').innerHTML = '';
    
    // disable follow/unfollow buttons by defult 
    let follow = document.querySelector('#follow');
    let unfollow = document.querySelector('#unfollow');
    follow.style.display = 'none';
    unfollow.style.display = 'none';

    // get followers and following numbers
    fetch(`/profile/${id}`)
    .then(response => response.json())
    .then(user => {
    //
      console.log(user);
      document.querySelector('#name').innerHTML =`<strong>${user.user.username}</strong>`;
      document.querySelector('#numberOfFollowing').innerHTML =`${user.followingCount}`;
      document.querySelector('#numberOfFollowers').innerHTML =`${user.followerCount}`;
 
    })
    //if user is not the profile owner : check if user is a follower or not
    if (id != document.querySelector('#userId').value){
        fetch(`/is_following/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message ==="not a follower.") {
                follow.style.display = 'block';
                follow.onclick = function(){
                    add_remove_follower(id);
                }
            }
            else {
                unfollow.style.display = 'block';
                unfollow.onclick = function(){
                    add_remove_follower(id);
                }
            }
        })
    }
    // get user's posts by user id
    fetch_posts('profile', num, id);
    return false;
}

function page_paginator(page, view, id) {
    let PageNumber = document.querySelector('#page-number');
    const paginator = document.createElement('div');
    paginator.classList.add("pagination");

    // if the page has previous page create button unable user to visit it
    if (page.has_previous ) {
        let previous = document.createElement('li');
        previous.innerHTML = `
        <a class="page-link" onclick="fetch_posts('${view}',this.id,${id});return false;"
         id="${page.previous_page_number}" href="#" aria-label="previous">
        &laquo;Previous</span></a>`
        previous.classList.add("page-item");
        PageNumber.append(previous);    
    }
     // if the page has next page create button unable user to visit it
    if (page.has_next) {      
        let next = document.createElement('li');
        next.innerHTML = `
        <a class="page-link" onclick="fetch_posts('${view}',this.id,${id});return false;"
         id="${page.next_page_number}"href="#" aria-label="Next">
        Next&raquo;</span></a>`
        next.classList.add("page-item");
        PageNumber.append(next);  
    }
}

function fetch_posts (view, num, id=null){
    // reset innerhtml 
    let AllPosts = document.querySelector('#all-posts');
    AllPosts.innerHTML = '';
    document.querySelector('#page-number').innerHTML = '';

    // if user want to see followings posts
    if (view == 'userFollowing') {
        // call get_following_posts api
        fetch(`/get_following_posts?page=${num}`)
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            // send posts in result to paginator function
            page_paginator(posts.page, 'userFollowing');
            create_element_to_every_post(posts.allposts);
        })    
    }
    // if user on profile view
    else if (view == 'profile') {
        // get user's posts by user id
        fetch(`/posts/${id}?page=${num}`)
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            // send posts in result to paginator function
            page_paginator(posts.page, 'profile', id);
            create_element_to_every_post(posts.allposts);
        })
    }
    // if user on all posts view
    else if (view == 'allposts'){
        // call api to get all posts
        fetch(`/posts?page=${num}`)
        .then(response => response.json())
        .then(page => {
            console.log(page);
            // send posts in result to paginator function
            page_paginator(page.page, 'allposts');
            create_element_to_every_post(page.allposts);
        })
    }
    return false;
}
// function takes all posts in one page and send it to add to dive function then apend every post in all posts div
function create_element_to_every_post(all){
    all.forEach(post =>{
        var element = add_post_to_div(post);
        document.querySelector('#all-posts').append(element);
    })
}

function add_remove_follower(id) {
    // call api to change the following state
    fetch(`/add_remove_follower/${id}`, {
        method: 'POST'
      })
      .then(response => response.json())
      .then(result => {
          console.log(result);
          // return to profile page
          profile_page(id);
        
      })
      .catch(error => {
        console.log('Error:', error); 
    });
}

function like_post(id, arg){
    // call api to update db and get new number of likes
    let post = document.getElementById(`${id}`);
    if (arg ==='add_like'){
        fetch(`/like/${id}`,
        {
            method: 'POST'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            post.innerHTML = `❤️
            ${result.likes} Likes`;
            post.onclick = function(){
                like_post(id, 'delete_like');
            }
        })
        .catch(error => {
            console.log('Error:', error); 
        });
    }
        // if unlike color will return 
        else {
            fetch(`/like/${id}`,
        {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            post.innerHTML = `🤍<span class="text-info"> ${result.likes} Likes</span>
           `;
           post.onclick = function(){
            like_post(id, 'add_like');
        }
        })
        .catch(error => {
            console.log('Error:', error); 
        });
    }
        return false;
}

function edit_post(post, id){
    document.querySelector('#new-post').style.display = 'block';
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('.pagination').style.display = 'none';
    document.querySelector('#text').value = `${post}`;
    document.querySelector('#submit').value  = "Edit";
    document.querySelector('#PostId').value  = id;
}

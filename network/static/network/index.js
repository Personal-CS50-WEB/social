document.addEventListener('DOMContentLoaded', function() {
    
    const userid =  document.querySelector('#userId').value;
    // when user click on any link on nav bar
    document.querySelector('#new-post-form').onsubmit = submit_post;
    document.querySelector('#allPosts').onclick = all_posts;
    document.querySelector('#userFollowing').onclick = function(){
        load_following(userid);
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
        // Prevent default submission 
        
        return false;
    }

function all_posts() {
    // display all posts and new post form 
    document.querySelector('#new-post').style.display = 'block';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';

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
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            // create div for each post
            var element = add_post_to_div(post);
            document.querySelector('#all-posts').append(element);  
        })

    })
    return false;
}

function load_following() {
   
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    document.querySelector('#all-posts').innerHTML = '';

    fetch('/get_following_posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            // create div for each post
            var element = add_post_to_div(post);
            document.querySelector('#all-posts').append(element);  
        })

    
})
}

function add_post_to_div(post){
    // create new div for a post
    const element = document.createElement('div');
    element.classList.add('card', 'new-card');
    element.innerHTML = `<div class="card-body">
        <h5 class="btn btn-outline-info" onclick="profile_page(${post.userId});"><strong>${post.user}</strong></h5>
        <p class="card-text">${post.text}</p>
        </div>
        <footer class="blockquote-footer">${post.timestamp}</footer>
        <div class="card-footer text-muted">${post.likes} Likes</div>
        `;
        return element;
}

function profile_page(id) {

    // display only profile information and posts.
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'block';
    document.querySelector('#all-posts').innerHTML = '';
    
    // diable follow/unfollow buttons by defult 
    document.querySelector('#follow').style.display = 'none';
    document.querySelector('#unfollow').style.display = 'none';

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
                document.querySelector('#follow').style.display = 'block';
            }
            else {
                document.querySelector('#unfollow').style.display = 'block';
            }
        })

    }
    
    // get user's posts by user id
    fetch(`/posts/${id}`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            // create div for each post
            var element = add_post_to_div(post);
            document.querySelector('#all-posts').append(element);  
        })
    })
    return false;
}
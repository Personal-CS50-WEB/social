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
        document.querySelector('#page-number').style.display = "flex";
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
        all_posts(1);
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

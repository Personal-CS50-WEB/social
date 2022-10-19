document.addEventListener('DOMContentLoaded', function() {
    // when user click on any link on nav bar
    document.querySelector('#following').addEventListener('click', () => load_following);
    document.querySelector('#new-post-form').onsubmit = submit_post;

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
        document.querySelector('#all-posts').before(element); 
        
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
    document.querySelector('#following').style.display = 'none';
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
  
}

function load_following() {
    document.querySelector('#following').style.display = 'block';
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#all-posts').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'none';


}

function add_post_to_div(post){
    // create new div for a post
    const element = document.createElement('div');
    element.classList.add('card', 'new-card');
    element.innerHTML = `<div class="card-body">
        <h5 class="card-title">${post.user}</h5>
        <p class="card-text">${post.text}</p>
        </div>
        <footer class="blockquote-footer">${post.timestamp}</footer>
        <div class="card-footer text-muted">${post.likes} Likes</div>
        `;
        return element;
}
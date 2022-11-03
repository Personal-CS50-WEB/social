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
    document.querySelector('#page-number').style.display = 'none';
    document.querySelector('#text').value = `${post}`;
    // change submit button value to 'edit'
    document.querySelector('#submit').value  = "Edit";
    document.querySelector('#PostId').value  = id;
}

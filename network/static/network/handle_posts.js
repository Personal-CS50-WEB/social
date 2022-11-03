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

// function takes all posts in one page and send it to add to dive function then apend every post in all posts div
function create_element_to_every_post(all){
    all.forEach(post =>{
        var element = add_post_to_div(post);
        document.querySelector('#all-posts').append(element);
    })
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
export function add_post_to_div(post){
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

export function page_paginator(page, view, id) {

    const paginator = document.createElement('div');
    paginator.classList.add("pagination");

    // if the page has previous page create button unable user to visit it
    if (page.has_previous ) {
        let previous = document.createElement('li');
        previous.innerHTML = `<a class="page-link" onclick="fetch_posts('${view}',this.id,${id});return false;" id="${page.previous_page_number}" href="#" aria-label="previous">&laquo;Previous</span></a>`
        previous.classList.add("page-item");
        document.querySelector('#page-number').append(previous);    
    }
    
    // if the page has next page create button unable user to visit it
    if (page.has_next) {      
        let next = document.createElement('li');
        next.innerHTML = `<a class="page-link" onclick="fetch_posts('${view}',this.id,${id});return false;" id="${page.next_page_number}"href="#" aria-label="Next">Next&raquo;</span></a>`
        next.classList.add("page-item");
        document.querySelector('#page-number').append(next);  
    }


}


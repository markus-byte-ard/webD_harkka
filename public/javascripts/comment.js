if (document.readyState !== "loading") {
    initializeCodeComments();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeComments();
    });
}

// Simple .js file for getting and posting comments
function initializeCodeComments() {
    getComments();
    console.log("initialize Comments");
    document.getElementById("comment-form").addEventListener("submit", onSubmit);
}

// Gets comments 
function getComments () {
    // if authToken is in localstorage user is logged in
    // not very safe, but works here
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) {
        console.log("No auth token"); 
    } else {
        // If user is logged in set form to create new comments visible and hide message and links to login and register
        console.log("Logged in Form should be visible");
        document.getElementById("form").style.display = "block";
        document.getElementById("LoginMessage").style.display = "none";
        document.getElementById("list-login").style.display = "none";
        document.getElementById("list-register").style.display = "none";
    }
}

// onSubmit for comment-form form
function onSubmit(event) {
    event.preventDefault();
    // Create formdata and append email from localstorage
    const formData = new FormData(event.target);
    formData.append("email", localStorage.getItem("email"));
    console.log(formData);
    // Send form data as req.body to route api.js route
    fetch("/api/comments/", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.Success) {
                // Sends user back to posts
                window.location.href = "/api/posts/";
            } else {
                if(data.message) {
                    document.getElementById("error").innerHTML = data.message;
                } else {
                    document.getElementById("error").innerHTML = "Unknown error";
                }
            }
        }) 
}
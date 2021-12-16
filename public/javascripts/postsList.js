if (document.readyState !== "loading") {
    initializeCodePosts();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodePosts();
    });
}
  
function initializeCodePosts() {
    getPosts();
    console.log("initialize Code Posts");
    document.getElementById("post-form").addEventListener("submit", onSubmit);
}

function getPosts () {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) {
        console.log("No auth token"); 
    } else {
        console.log("Logged in Form should be visible");
        document.getElementById("form").style.display = "block";
        document.getElementById("LoginMessage").style.display = "none";
        document.getElementById("list-login").style.display = "none";
        document.getElementById("list-register").style.display = "none";
    }
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.email = localStorage.getItem("email");
    console.log(formData);
    fetch("/api/posts", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.Success) {
                window.location.href = "/api/posts.html";
            } else {
                if(data.message) {
                    document.getElementById("error").innerHTML = data.message;
                } else {
                    document.getElementById("error").innerHTML = "Unknown error";
                }
            }
        }) 
}
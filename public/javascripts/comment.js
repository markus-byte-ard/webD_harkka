if (document.readyState !== "loading") {
    initializeCodeComments();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeComments();
    });
}
  
function initializeCodeComments() {
    getComments();
    console.log("initialize Comments");
    document.getElementById("comment-form").addEventListener("submit", onSubmit);
}

function getComments () {
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
    formData.append("email", localStorage.getItem("email"));
    console.log(formData);
    fetch("/api/comments/", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.Success) {
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
if (document.readyState !== "loading") {
    initializeCodePosts();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodePosts();
    });
}

function initializeCodePosts() {
    console.log("initialize Code Posts");
    document.getElementById("post-form").addEventListener("submit", onSubmit);
}


function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.email = localStorage.getItem("email");
    console.log(formData);
    fetch("/posts", {
        method: "POST",
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.Success) {
                window.location.href = "/posts.html";
            } else {
                if(data.message) {
                    document.getElementById("error").innerHTML = data.message;
                } else {
                    document.getElementById("error").innerHTML = "Unknown error";
                }
            }
        }) 
}

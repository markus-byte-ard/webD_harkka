if (document.readyState !== "loading") {
    initializeCodeLogin();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
}
// Simple .js file for loggin in
function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", onSubmit);
}

// onSubmit sends formdata to routes users.js 
function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/users/login", {
        method: "POST",
        body: formData 
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.token && data.email) {
                // If authorization is succesful token and email are stored
                store(data.token, data.email);
                window.location.href = "/";
            } else {
                if(data.message) {
                    document.getElementById("error").innerHTML = data.message;
                } else {
                    document.getElementById("error").innerHTML = "Unknown error";
                }
            }
        }) 
}

// Functio stores token and email to localStorage
function store(token, email) {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("email", email);
}
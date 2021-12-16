if (document.readyState !== "loading") {
    initializeCodeRegister();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeRegister();
    });
}

// Simple .js file for registering new users
function initializeCodeRegister() {
    document.getElementById("register-form").addEventListener("submit", onSubmit);
}

// onSubmit sends formdata to routes users.js 
function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch("/register", {
        method: "POST",
        body: formData 
    })
        .then((response) => response.json())
        .then((data) => {
            if(data.Success) {
                // If registeration was succesful sends user to login screen
                window.location.href = "/login.html";
            } else {
                if(data.message) {
                    document.getElementById("error").innerHTML = data.message;
                } else {
                    document.getElementById("error").innerHTML = "Unknown error";
                }
            }
        }) 
}

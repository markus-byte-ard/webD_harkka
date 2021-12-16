if (document.readyState !== "loading") {
    initializeCodeLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
  }
  
  function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", onSubmit);
}

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

function store(token, email) {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("email", email);
}
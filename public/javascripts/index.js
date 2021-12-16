if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }

// Simple .js file updating index page after loggin in and adds logout functionality
function initializeCode() {
  // if authToken is in localstorage user is logged in
  // not very safe, but works here
  if(localStorage.getItem("auth_token")) {
    // Hide login and register from menu
    document.getElementById("list-login").style.display = "none";
    document.getElementById("list-register").style.display = "none";
    
    // Create new button and text
    let container = document.getElementById("container");
    let btn = document.createElement("button");
    let email = document.createElement("p");

    btn.classList.add("btn");
    btn.id = "logout";
    btn.type = "submit";
    email.id = "email";

    email.innerHTML = localStorage.getItem("email");
    btn.innerHTML = "Logout";

    // Text shows user email who is logged in
    container.appendChild(email);
    // Button is for logout
    container.appendChild(btn);

    btn.addEventListener("click", onClick);
  }
}

// Logout function just clears localstorage
function onClick () {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("email");
  window.location.href = "/";
}
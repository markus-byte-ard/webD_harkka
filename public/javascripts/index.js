if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
  function initializeCode() {
    if(localStorage.getItem("auth_token")) {
      document.getElementById("list-login").style.display = "none";
      document.getElementById("list-register").style.display = "none";
      
      let container = document.getElementById("container");
      let btn = document.createElement("button");
      let email = document.createElement("p");

      btn.classList.add("btn");
      btn.id = "logout";
      btn.type = "submit";
      email.id = "email";

      email.innerHTML = localStorage.getItem("email");
      btn.innerHTML = "Logout";

      container.appendChild(email);
      container.appendChild(btn);

      btn.addEventListener("click", onClick);
    }
}

function onClick () {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("email");
  window.location.href = "/";
}
if (document.readyState !== "loading") {
    initializeCodeRegister();
} else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeRegister();
    });
}
  
  function initializeCodeRegister() {
    document.getElementById("register-form").addEventListener("submit", onSubmit);
}

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

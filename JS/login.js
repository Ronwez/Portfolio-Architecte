document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    let emailInput = document.getElementById("email");
    let passwordInput = document.getElementById("motdepasse");
    let email = emailInput.value;
    let password = passwordInput.value;
    let errorMessage = document.getElementById("errorMessage");
  
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => {
      console.log(response)
      console.log(response.status) 
      if (response.status === 200) { //200=code serveur pour connecté
        response = response.json();
        const token = response.token; 
        sessionStorage.setItem("token", token);
        window.location.href = "index.html";
      } else {
        emailInput.style.border = "1px solid red";
        passwordInput.style.border = "1px solid red";
        errorMessage.style.display = "block";
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  });
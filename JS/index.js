let response = [];

//AFICHER LA GALLERIE

async function afficherDonneesApi() {
  try {
    const Apiworks = await fetch("http://localhost:5678/api/works");
    const response = await Apiworks.json();

    const affichage_image = document.querySelector(".gallery");
    const affichage_title = document.querySelector("#title");

    for (let i = 0; i < response.length; i++) {
      const { title, imageUrl } = response[i];

      const itemHtml = `
        <div class="item">
          <img src="${imageUrl}">
          <figcaption>${title}</figcaption>
        </div>
      `;

      affichage_image.insertAdjacentHTML("beforeend", itemHtml);
    }
  } catch (err) {
    console.log(err);
  }}

afficherDonneesApi();

//FILTRES

async function fetchData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    throw new Error(`Erreur lors de la récupération des données : ${err}`);
  }
}

function afficherImages(response) {
  const affichage_image = document.querySelector(".gallery");
  affichage_image.innerHTML = "";
  for (const { title, imageUrl } of response) {
    const itemHtml = `
      <div class="item">
        <img src="${imageUrl}">
        <figcaption>${title}</figcaption>
      </div>
    `;
    affichage_image.insertAdjacentHTML("beforeend", itemHtml);
  }
}

async function filtrerParCategorie(categorieId) {
  try {
    const response = await fetchData("http://localhost:5678/api/works");
    const filteredResponse = response.filter((item) => item.categoryId === categorieId);
    afficherImages(filteredResponse);
  } catch (err) {
    console.log(err);
  }
}

async function afficherToutesLesDonnees() {
  try {
    const response = await fetchData("http://localhost:5678/api/works");
    afficherImages(response);
  } catch (err) {
    console.log(err);
  }
}

async function ajouterGestionnairesFiltres() {
  try {
    const response = await fetchData("http://localhost:5678/api/works");
    const btnAll = document.querySelector(".btnfilall");
    const btnObjets = document.querySelector(".btnfil1");
    const btnAppartements = document.querySelector(".btnfil2");
    const btnHotelsRestaurants = document.querySelector(".btnfil3");

    btnAll.addEventListener("click", afficherToutesLesDonnees);
    btnObjets.addEventListener("click", () => filtrerParCategorie(1));
    btnAppartements.addEventListener("click", () => filtrerParCategorie(2));
    btnHotelsRestaurants.addEventListener("click", () => filtrerParCategorie(3));
  } catch (err) {
    console.log(err);
  }
}

ajouterGestionnairesFiltres();



//Log-in MAJ home-page

document.addEventListener("DOMContentLoaded", function() {
  const token = sessionStorage.getItem("token");
  if (token) {
    console.log("Token found:", token);
    const connected1 = document.getElementById("connected1");
    const connected2 = document.getElementById("connected2");
    const connected3 = document.getElementById("connected3");
    const divFiltres = document.querySelector(".filtres");
    const loginLogoutLink = document.getElementById("loginLogoutLink");
    connected1.style.display = "block";
    connected2.style.display = "block";
    connected3.style.display = "block";
    divFiltres.style.display = "none";
    loginLogoutLink.textContent = "logout";
    const deletedImages = JSON.parse(sessionStorage.getItem("deletedImages") || "[]");
  }
});


//MODAL

var modal = document.getElementById("myModal");

// ouverture modal
var btn = document.getElementById("connected3");

// fermeture modal
var span = document.getElementsByClassName("close")[0];

// affichage modal
btn.onclick = async function() {
  modal.style.display = "block";

  try {
    const Apiworks = await fetch("http://localhost:5678/api/works");
    response = await Apiworks.json();
    const imageContainer = document.querySelector(".image-container");
    imageContainer.innerHTML = ""; // Vide le contenu précédent

    for (let i = 0; i < response.length; i++) {
      const { imageUrl } = response[i];

      const imageHtml = `
        <div class="item">
          <i class="fa-solid fa-trash-can" data-index="${i}"></i>
          <img class="modal-image" src="${imageUrl}">
          <figcaption>Éditer</figcaption>
        </div>
      `;

      imageContainer.insertAdjacentHTML("beforeend", imageHtml);
    }
  } catch (err) {
    console.log(err);
  }
}

// click fermeture
span.onclick = function() {
  modal.style.display = "none";
}

// click en dehors = fermeture
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//suppression d'image
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    if (index !== null) {
      const imageContainers = document.querySelectorAll(".item");
      const homePageImages = document.querySelectorAll(".gallery .item");

      const deletedImageInfo = {
        index: index,
        imageUrl: response[index].imageUrl
      };
      const deletedImages = JSON.parse(sessionStorage.getItem("deletedImages") || "[]");
      deletedImages.push(deletedImageInfo);
      sessionStorage.setItem("deletedImages", JSON.stringify(deletedImages));

      imageContainers[index].remove();
      homePageImages[index].remove(); 
    }
  }
});


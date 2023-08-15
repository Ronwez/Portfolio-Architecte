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
  }
});

//MODAL

var modalGallery = document.getElementById("myModal");
var firstModal = document.querySelector(".modal-gallery"); // Nouveau nom de la première modal
var modalAddPicture = document.getElementById("myModal2"); // Sélection de la deuxième modal

// ouverture modal
var btn = document.getElementById("connected3");

// affichage modal
btn.onclick = async function() {
  modalGallery.style.display = "block"; // Utiliser modalGallery pour afficher la modal principale

  try {
    const Apiworks = await fetch("http://localhost:5678/api/works");
    response = await Apiworks.json();
    const imageContainer = firstModal.querySelector(".image-container"); // Utilisation de firstModal pour cibler la première modal
    imageContainer.innerHTML = ""; // Vide le contenu précédent

    for (let i = 0; i < response.length; i++) {
      const { imageUrl } = response[i];

      const imageHtml = `
        <div class="item">
          <i class="fa-solid fa-up-down-left-right"></i>
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

// Fermeture des modals
function closeModal() {
  modalGallery.style.display = "none";
}

// Click sur la croix pour fermer la modal
var closeBtns = document.querySelectorAll(".modal-content .close");
closeBtns.forEach(function(closeBtn) {
  closeBtn.addEventListener("click", closeModal);
});

// Click en dehors des modals pour fermer
window.onclick = function(event) {
  if (event.target === modalGallery) {
    closeModal();
  }
  if (event.target === modalAddPicture) {
    closeModal();
  }
}

//suppression d'image

document.addEventListener("click", async function(event) {
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    if (index !== null) {
      console.log("Starting deletion process...");

      const itemIdToDelete = response[index].id;
      console.log("Item ID to delete:", itemIdToDelete);

      const token = sessionStorage.getItem("token"); // Récupérer le token d'accès
      console.log("Token:", token);

      const deleteUrl = `http://localhost:5678/api/works/${itemIdToDelete}`;
      console.log("DELETE URL:", deleteUrl);

      try {
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}` // Inclure le token d'accès dans l'en-tête
          }
        });

        console.log("Delete response:", deleteResponse);

        if (deleteResponse.status === 200) { 
          const deleteResult = await deleteResponse.json();
          console.log("Delete result:", deleteResult);

          if (deleteResult.status === "success") {
            response.splice(index, 1);

            const affichage_image = document.querySelector(".gallery");
            affichage_image.innerHTML = ""; 
            afficherImages(response); 
          } else {
            console.log("Erreur lors de la suppression côté serveur.");
          }
        } else {
          console.log("Erreur lors de la suppression côté client.");
        }
      } catch (err) {
        console.log("Error:", err);
      }
    }
  }
});


///modal--add-photo
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("add-picture")) {
    const firstModal = document.querySelector(".modal-content");
    const secondModal = document.querySelector(".modal-add-picture");

    firstModal.style.display = "none"; 
    secondModal.style.display = "block"; 
  }
});

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("fa-arrow-left")) {
    console.log("Arrow left clicked");

    const firstModal = document.querySelector(".modal-gallery");
    const secondModal = document.querySelector(".modal-add-picture");

    console.log("First modal:", firstModal);
    console.log("Second modal:", secondModal);

    secondModal.style.display = "none"; 
    firstModal.style.display = "block"; 

    console.log("First modal display:", firstModal.style.display);
    console.log("Second modal display:", secondModal.style.display);
  }
});








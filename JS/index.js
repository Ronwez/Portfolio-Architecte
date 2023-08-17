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
var firstModal = document.querySelector(".modal-gallery");
var modalAddPicture = document.getElementById("myModal2");

var premierePageHTML = ""; // Variable pour sauvegarder le contenu de la première page

// ouverture modal
var btn = document.getElementById("connected3");

// affichage modal
btn.onclick = async function() {
  modalGallery.style.display = "block";

  if (premierePageHTML === "") {
    try {
      const Apiworks = await fetch("http://localhost:5678/api/works");
      response = await Apiworks.json();
      const imageContainer = firstModal.querySelector(".image-container");
      premierePageHTML = imageContainer.innerHTML; // Sauvegarder le contenu de la première page
      imageContainer.innerHTML = ""; // Vider le contenu précédent

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
  } else {
    // Restaurer le contenu de la première page
    const imageContainer = firstModal.querySelector(".image-container");
    imageContainer.innerHTML = premierePageHTML;
  }
};

// Restaurer le contenu de la première page lorsque la modal est fermée
function closeModal() {
  modalGallery.style.display = "none";
  const imageContainer = firstModal.querySelector(".image-container");
  imageContainer.innerHTML = premierePageHTML;
}

// Gérer la fermeture des modals
var closeBtns = document.querySelectorAll(".close");
closeBtns.forEach(function(closeBtn) {
  closeBtn.addEventListener("click", closeModal);
});

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
// Sélectionner le bouton "Ajouter une photo"
const addPictureButton = document.querySelector(".add-picture");

// Ajouter un gestionnaire d'événements au bouton
addPictureButton.addEventListener("click", function() {
    // Contenu HTML de la deuxième page de modal
    const deuxiemePageHTML = `
      <span class="close">&times;</span>
      <i class="fa-solid fa-arrow-left back-to-first-page"></i>
        <h2>Ajouter photo</h2>
        <div class="add-pic-card">
          <div id="image-preview" class="image-preview"></div>
            <i class="fa-regular fa-image"></i>
            <label for="addPhotoInput" class="add-photo-label">+ Ajouter photo</label>
            <input type="file" id="addPhotoInput" accept="image/*" class="add-photo-input">
            <p> jpg, png : 4mo max </p>
            <div class="pic-description">
              <label for="titre">Titre</label>
              <input type="text" id="titre" name="titre">
              
              <label for="categorie">Catégorie</label>
              <select id="categorie" name="categorie">
                <option value="categorie0"></option>
                <option value="categorie1">Objets</option>
                <option value="categorie2">Appartements</option>
                <option value="categorie3">Hotels et restaurants</option>
              </select>
            </div>
        </div>
        <hr>
        <input type="submit" value="Valider" class="valid-picture">
    `;
    const modalContent = modalGallery.querySelector(".modal-content");
    
    modalContent.innerHTML = deuxiemePageHTML;
});

///prévisualiser l'image
const addPhotoInput = document.getElementById("addPhotoInput");
const imagePreview = document.getElementById("image-preview");

addPhotoInput.addEventListener("change", function(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const imageDataURL = event.target.result;

            // Cacher les éléments existants
            addPhotoInput.style.display = "none";

            // Afficher l'image sélectionnée
            const image = document.createElement("img");
            image.src = imageDataURL;
            imagePreview.appendChild(image);
        };

        reader.readAsDataURL(selectedFile);
    }
});

///techniquement sert à passer à l'ancienne modale
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("back-to-first-page")) {
    const modalContent = modalGallery.querySelector(".modal-content");
    modalContent.innerHTML = premierePageHTML; // Réinsérez le contenu de la première page
  }
});


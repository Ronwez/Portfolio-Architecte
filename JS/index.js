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

// Variable globale pour stocker les données de la galerie
let galleryData = null;
// Fonction pour charger les données de la galerie
/*async function chargerDonneesGalerie() {
  const data = null;

  fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(apiData => {
    console.log(apiData);
    data = apiData
  })
  .catch(err => console.log(err))

  return data;
}*/


const loadGalleryData = new Promise ((resolve, reject) => {
  fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(apiData => resolve(apiData))
  .catch(err => reject(err))
});

// Appel pour charger les données de la galerie lorsque la page est chargée
window.addEventListener("DOMContentLoaded", chargerDonneesGalerie);
let galleryModal = document.getElementById("galleryModal");
let addPictureModal = document.getElementById("addPhotoModal");
let btn = document.getElementById("connected3");

// affichage modal
btn.onclick = async function() {
  galleryModal.style.display = "block";
    
  const imageContainer = galleryModal.querySelector(".image-container");
  imageContainer.innerHTML = ""; // Effacer le contenu précédent de la galerie
  loadGalleryData
  .then(galleryData => {
    for (let i = 0; i < galleryData.length; i++) {
      const { imageUrl } = galleryData [i];
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
    
  })
  .catch(err => console.log(err))


};

    //fermeture modal
    function closeModal() {
      galleryModal.style.display = "none";
      addPictureModal.style.display = "none";
      // Reset des valeurs form
    titreInput.value = "";  // Reset titre
    categorieSelect.value = "0"; // Reset categorie
    addPhotoInput.value = ""; // Reset file input
    imagePreview.innerHTML = ""; // Reset select image
    addPhotoLabel.style.display = "block";
    addPhotoIcon.style.display = "block";
    maxSizeInfo.style.display = "block";
    }

    const closeButtons = document.querySelectorAll(".close");
    closeButtons.forEach(button => {
      button.addEventListener("click", closeModal);
    });
    
  window.addEventListener("click", function(event) {
    if (event.target === galleryModal) {
      closeModal();
    }
    if (event.target === addPictureModal) {
      closeModal();
    }
  });

//suppression d'image
document.addEventListener("click", async function(event) {
  if (event.target.classList.contains("fa-trash-can")) {
    const index = event.target.getAttribute("data-index");
    if (index !== null) {
      console.log("Starting deletion process...");
      const itemIdToDelete = galleryData[index].id; 
      console.log("Item ID to delete:", itemIdToDelete);
      const token = sessionStorage.getItem("token"); 
      console.log("Token:", token);

      const deleteUrl = `http://localhost:5678/api/works/${itemIdToDelete}`;
      console.log("DELETE URL:", deleteUrl);

      try {
        const deleteResponse = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("Delete response:", deleteResponse);

        if (deleteResponse.status === 204) { // Statut 204 indique succès 
          // Supprimer l'élément de la modal
          const itemToDelete = event.target.parentElement;
          itemToDelete.remove();
          console.log("Item deleted successfully.");
          //Supprimer l'élément de la galerie home-page
          const homePageGalleryItems = document.querySelectorAll(".gallery .item");
          if (homePageGalleryItems[index]) {
            homePageGalleryItems[index].remove();
          }

          galleryData.splice(index, 1);
        } else {
          console.log("Erreur lors de la suppression côté serveur.");
        }
      } catch (err) {
        console.log("Error:", err);
      }
    }
  }
});


//Ouverture seconde modal
const addPictureButton = document.querySelector(".add-picture");
const secondModal = document.querySelector(".add-picture-modal");
addPictureButton.addEventListener("click", function() {
  galleryModal.style.display = "none";
  addPictureModal.style.display = "block";
});

//gestion flèche retour
const backModal = document.querySelector(".back-to-first-page");
backModal.addEventListener("click", function (){
  addPictureModal.style.display = "none";
  galleryModal.style.display = "block";
});

//Prévisualiser l'image dans la modal
const addPhotoInput = document.getElementById("addPhotoInput");
const imagePreview = document.getElementById("image-preview");
const addPhotoLabel = document.querySelector(".add-photo-label");
const addPhotoIcon = document.querySelector(".fa-regular.fa-image");
const maxSizeInfo = document.querySelector(".maxSizeInfo");

addPhotoInput.addEventListener("change", function(event) {
  const selectedFile = event.target.files[0]; // Obtenir le fichier sélectionné
  if (selectedFile) {
    const imageURL = URL.createObjectURL(selectedFile);
    imagePreview.innerHTML = `<img src="${imageURL}" alt="Prévisualisation de l'image">`;

    addPhotoLabel.style.display = "none";
    addPhotoIcon.style.display = "none";
    maxSizeInfo.style.display = "none";
  } else {
    addPhotoLabel.style.display = "block";
    addPhotoIcon.style.display = "block";
    maxSizeInfo.style.display = "block";
    imagePreview.innerHTML = ""; // Effacer la prévisualisation
  }
});

//Envoie du formulaire + vérif formulaire rempli
const validPictureButton = document.getElementById("valid-picture");
const titreInput = document.getElementById("titre");
const categorieSelect = document.getElementById("categorie");
const fileInput = document.getElementById("addPhotoInput");

const addModalForm = document.querySelector("#addPhotoModal");
console.log(addModalForm);
addModalForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  titreInput.style.borderColor = "";
  categorieSelect.style.borderColor = "";

  if (!titreInput.value || categorieSelect.value === "0" || !fileInput.files[0]) {
    alert("Formulaire incorrect. Veuillez remplir tous les champs.");
    if (!titreInput.value) {
      titreInput.style.border = "1px solid red";
    }
    if (categorieSelect.value === "0") {
      categorieSelect.style.border = "1px solid red";
    }
    return;
  }
  const title = titreInput.value;
  const category = categorieSelect.value;


  //Fonction d'ajout de l'image
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("title", title);
  formData.append("category", category);
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    console.log("Vous devez être connecté pour ajouter un élément à la galerie.");
  } else {
    // Afficher le contenu de FormData dans la console
    console.log("Données envoyées au serveur :", formData);
  
    fetch("http://localhost:5678/api/works", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`
  },
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log(data); // Les données de l'élément ajouté

    // Après avoir ajouté l'élément avec succès, mettez à jour les galeries
    mettreAJourGalerieAccueil();
    mettreAJourModalGalerie();

    closeModal();
  })
  .catch(error => console.log(error));





// Fonction pour mettre à jour la galerie sur la page d'accueil
async function mettreAJourGalerieAccueil() {
  try {
    const updatedResponse = await fetch("http://localhost:5678/api/works");
    const updatedData = await updatedResponse.json();
    const homePageGallery = document.querySelector(".gallery");

    // Utilisez la constante updatedData pour mettre à jour la galerie
    // Remplacez le contenu existant par les nouvelles images
    const imagesHTML = updatedData.map(image => {
      return `
        <div class="item">
          <img src="${image.imageUrl}" alt="${image.title}">
          <figcaption>${image.title}</figcaption>
        </div>
      `;
    });

    homePageGallery.innerHTML = imagesHTML.join(''); // Remplace le contenu existant
    console.log("Mise à jour de la galerie d'accueil terminée.");
  } catch (err) {
    console.log("Erreur lors de la mise à jour de la galerie de la page d'accueil :", err);
  }
}

// Fonction pour mettre à jour la modal galerie
async function mettreAJourModalGalerie() {
  try {
    const updatedResponse = await fetch("http://localhost:5678/api/works");
    const updatedData = await updatedResponse.json();
    console.log("Données mises à jour depuis l'API :", updatedData);
    const modalGallery = document.querySelector(".image-container");

    // Utilisez la constante updatedData pour mettre à jour la modal galerie
    // Remplacez le contenu existant par les nouvelles images
    const imagesHTML = updatedData.map(image => {
      return `
        <div class="item">
          <i class="fa-solid fa-up-down-left-right"></i>
          <i class="fa-solid fa-trash-can" data-index="${image.id}"></i>
          <img class="modal-image" src="${image.imageUrl}">
          <figcaption>Éditer</figcaption>
        </div>
      `;
    });

    modalGallery.innerHTML = imagesHTML.join(''); // Remplace le contenu existant

    console.log("Mise à jour de la galerie modale terminée.");
  } catch (err) {
    console.log("Erreur lors de la mise à jour de la modal galerie :", err);
  }
}

}});


//Définition d'un item pour l'ajout d'éléments
let itemHtml = ''; //variables et non constante, car nouvel élément

async function chargerDonneesGalerie() {
  try {
    const Apiworks = await fetch("http://localhost:5678/api/works");
    galleryData = await Apiworks.json();
    
    // Créez le modèle HTML pour afficher les images dans la galerie
    itemHtml = galleryData.map(({ title, imageUrl }) => `
      <div class="item">
        <img src="${imageUrl}">
        <figcaption>${title}</figcaption>
      </div>
    `).join('');
  } catch (err) {
    console.log(err);
  }
};


function updateButtonState() {
  if (!titreInput.value || categorieSelect.value === "0" || !fileInput.files[0]) {
    validPictureButton.style.backgroundColor="grey";
    validPictureButton.style.color="black";
    validPictureButton.style.cursor="not-allowed";
  } else {
    validPictureButton.style.backgroundColor="";
    validPictureButton.style.color="";
    validPictureButton.style.cursor="";
  }
}

// Add event listeners to form fields to update button state on change
titreInput.addEventListener("input", updateButtonState);
categorieSelect.addEventListener("change", updateButtonState);
fileInput.addEventListener("change", updateButtonState);

// Initial button state on page load
updateButtonState();
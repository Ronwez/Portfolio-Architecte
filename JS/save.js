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
      const categoriesData = await fetchData("http://localhost:5678/api/categories");
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
  
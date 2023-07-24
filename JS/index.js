async function afficherDonneesApi() {
  try {
    const Apiworks = await fetch("http://localhost:5678/api/works");
    const response = await Apiworks.json();

    const affichage_image = document.querySelector(".gallery");
    const affichage_title = document.querySelector("#title");

    for (let i = 0; i < response.length; i++) {
      const { id, title, imageUrl } = response[i];

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



const Apicategories = async () =>{
  const response = await fetch("http://localhost:5678/api/categories");
  const jsonData = await response .json();
  return jsonData;
  }

  function filterObjets() {
    const galleryItems = document.querySelectorAll(".gallery .item");
    galleryItems.forEach(item => {
      const categoryId = parseInt(item.getAttribute("data-category-id"));
      if (categoryId === 1) {
        item.style.display = "block"; 
      } else {
        item.style.display = "none"; 
      }
    });
  }
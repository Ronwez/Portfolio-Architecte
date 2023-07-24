const Apiworks = fetch ("http://localhost:5678/api/works")

Apiworks.then (async (responseData) => {
const response = await responseData.json();
console.log(response[0]);

try {

  const id = response [0].id;
  const title = response [0].title;
  const imageUrl = response [0].imageUrl;
  const categoryId = response [0].categoryId;
  const userId = response [0].userId;
  const affichage_image = document.querySelector("#image01")

  const affichage_title = document.querySelector("#title");
  affichage_title.innerHTML = title;

  const image01_imageUrl = `<img src="${imageUrl}">`;

  affichage_image.insertAdjacentHTML("afterbegin", image01_imageUrl);


  } catch (err) {
    console.log(err);
  }
});
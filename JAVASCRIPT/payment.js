document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Charger le panier depuis localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const grid = document.getElementById("purchaseGrid"); // où afficher les produits

  if (!grid) return; // si l'élément n'existe pas, arrêter

  // 2️⃣ Si le panier est vide, afficher un message
  if (cart.length === 0) {
    grid.innerHTML = "<p>Votre panier est vide.</p>";
    return;
  }

  // 3️⃣ Ajouter chaque produit du panier dans la grille
  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("purchase-item");

    // Afficher seulement l'image avec le nom en alt/title
    div.innerHTML = `<img src="${item.image}" alt="${item.nom}" title="${item.nom}">`;

    grid.appendChild(div);
  });
});

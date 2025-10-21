// 1️⃣ Sélectionner le conteneur où afficher les produits du panier
const cartContainer = document.querySelector(".cart-list");

// 2️⃣ Charger les données du panier depuis le localStorage (ou tableau vide si rien)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fonction pour afficher (ou mettre à jour) le panier
function renderCart() {
  // Effacer le contenu avant de recréer la liste
  cartContainer.innerHTML = "";

  // 3️⃣ Si le panier est vide, afficher un message et mettre le total à zéro
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Votre panier est vide.</p>";
    updateTotal(); // (fonction séparée pour calculer le total)
    return;
  }

  // 4️⃣ Pour chaque produit du panier, créer un bloc HTML
  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    // Structure visuelle de l'article : image, nom, prix et quantité
    div.innerHTML = `
      <img class="product__img" src="${item.image}" alt="${item.nom}">
      <div class="product__info">
        <div class="product__name">${item.nom}</div>
        <div class="product__price">€${item.prix}</div>

        <div class="qty">
          <button class="qty__btn minus">−</button>
          <div class="qty__value">${item.quantity}</div>
          <button class="qty__btn plus">+</button>
        </div>
      </div>
    `;

    // 5️⃣ Récupérer les boutons + et − et la valeur de quantité
    const minusBtn = div.querySelector(".minus");
    const plusBtn = div.querySelector(".plus");
    const qtyValue = div.querySelector(".qty__value");

    // --- Bouton "−" : diminuer la quantité ou supprimer le produit ---
    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1; // réduire la quantité
      } else {
        // Si quantité = 1, demander confirmation avant suppression
        if (confirm("Supprimer ce produit du panier ?")) {
          cart = cart.filter(p => p.nom !== item.nom); // supprimer du panier
        }
      }

      // Sauvegarder les changements et recharger l'affichage
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    // --- Bouton "+" : augmenter la quantité ---
    plusBtn.addEventListener("click", () => {
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    // Ajouter l'article au conteneur
    cartContainer.appendChild(div);
  });

  // 6️⃣ Mettre à jour le total du panier (prix global)
  updateTotal();
}

// 7️⃣ Appeler la fonction une première fois au chargement de la page
renderCart();

// --- Function to recalculate total price ---
// This function always recalculates the total based on
// the CURRENT items present in the cart.
function updateTotal() {
  // Get all items currently in the cart (in case some were deleted)
  const currentItems = document.querySelectorAll(".cart-item");
  let total = 0;

  // Loop through each cart item and calculate subtotal
  currentItems.forEach(item => {
    // Get the price text (example: "€29.90")
    const priceText = item.querySelector(".product__price").textContent;

    // Convert the price text to a number (remove € symbol)
    const price = parseFloat(priceText.replace("€", ""));

    // Get the quantity number (example: "2")
    const qty = parseInt(item.querySelector(".qty__value").textContent);

    // Add this product's total to the global total
    total += price * qty;
  });

  // Update the total price shown at the bottom of the cart
  const totalElement = document.querySelector(".total span:last-child");
  totalElement.textContent = `€${total.toFixed(2)}`;
}

// --- Add event listeners to each "+" and "−" button ---
// We select all current cart items at the beginning
const cartItems = document.querySelectorAll(".cart-item");

// Loop through each product in the cart
cartItems.forEach(item => {
  // Select the minus and plus buttons
  const minusBtn = item.querySelectorAll(".qty__btn")[0]; // The "−" button
  const plusBtn = item.querySelectorAll(".qty__btn")[1];  // The "+" button

  // Select the quantity text element
  const qtyValue = item.querySelector(".qty__value");

  // --- When user clicks the "−" button ---
  minusBtn.addEventListener("click", () => {
    let currentQty = parseInt(qtyValue.textContent);

    // If quantity is more than 1 → just decrease by 1
    if (currentQty > 1) {
      qtyValue.textContent = currentQty - 1;
      updateTotal(); // Recalculate total
    } else {
      // If quantity is 1 → ask for confirmation before removing product
      const confirmDelete = confirm("Do you really want to remove this product?");
      if (confirmDelete) {
        // If user confirms → remove product and update total
        item.remove();
        updateTotal();
      } else {
        // If user cancels → keep product with quantity = 1
        qtyValue.textContent = 1;
      }
    }
  });

  // --- When user clicks the "+" button ---
  plusBtn.addEventListener("click", () => {
    let currentQty = parseInt(qtyValue.textContent);

    // Increase quantity by 1 and update total
    qtyValue.textContent = currentQty + 1;
    updateTotal();
  });
});

// --- Run once when the page loads ---
// This ensures the total is correct on initial load
updateTotal();

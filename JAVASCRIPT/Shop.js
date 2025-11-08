// products.js

document.addEventListener("DOMContentLoaded", () => {

  // --- 1️⃣ Lire le paramètre de catégorie depuis l'URL (?category=homme ou ?category=femme)
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("category");

  // --- 2️⃣ Initialiser la liste des produits
  // !!! Не удаляем localStorage, оставляем для избранного и корзины
  let produits = [
    { nom: "White T-shirt", prix: 3.99, couleur: "White", image: "../Images/Shop/Simple tshirt (white).webp", category: "female", size: "m", isNew: false },
    { nom: "Black T-shirt", prix: 4.39, couleur: "Black", image: "../Images/Shop/Simple manteau (black).webp", category: "female", size: "s", isNew: true },
    { nom: "Red T-shirt", prix: 15.99, couleur: "Red", image: "../Images/Shop/RED Simple tshirt (Red).webp", category: "male", size: "m", isNew: true },
    { nom: "Blue T-shirt", prix: 10, couleur: "White", image: "../Images/Shop/Simple tshirt_(white).webp", category: "male", size: "l", isNew: false },
    { nom: "Yellow T-shirt", prix: 44.79, couleur: "Yellow", image: "../Images/Shop/Simple pantalon (yellow).webp", category: "male", size: "xl", isNew: false },
    { nom: "Pink T-shirt", prix: 52.99, couleur: "Pink", image: "../Images/Shop/Simple tshirt (rose).webp", category: "female", size: "xs", isNew: false },
    { nom: "White T-shirt", prix: 3.99, couleur: "White", image: "../Images/Shop/Simple tshirt_(white).webp", category: "male", size: "m", isNew: false },
    { nom: "Black T-shirt", prix: 64.39, couleur: "Black", image: "../Images/Shop/Simple tshirt (black).webp", category: "male", size: "s", isNew: false },
    { nom: "Red T-shirt", prix: 25.99, couleur: "Red", image: "../Images/Shop/Simple tshirt (red).webp", category: "male", size: "m", isNew: true },
    { nom: "Blue T-shirt", prix: 10, couleur: "Blue", image: "../Images/Shop/Simple tshirt (blue).webp", category: "female", size: "l", isNew: false }
  ];

  // --- 3️⃣ Sélectionner les éléments HTML
  const grid = document.getElementById("productGrid");
  const genderSelect = document.getElementById("Gender");
  const colorSelect = document.getElementById("Color");
  const sizeSelect = document.getElementById("Size");
  const sortSelect = document.getElementById("Sort");

  // --- Charger favoris et panier depuis localStorage
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --- 4️⃣ Mettre à jour le compteur de favoris
  function updateFavorisCount() {
    const countSpan = document.getElementById("favorisCount");
    if (!countSpan) return;
    countSpan.textContent = favoris.length;
    countSpan.style.visibility = favoris.length > 0 ? "visible" : "hidden";
  }

  // --- 5️⃣ Mettre à jour le compteur du panier
  function updateCartCount() {
    const countSpan = document.getElementById("cartCount");
    if (!countSpan) return;
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countSpan.textContent = total;
    countSpan.style.visibility = total > 0 ? "visible" : "hidden";
  }

  // --- 6️⃣ Afficher les produits sur la page
  function displayProducts(list) {
    if (!grid) return;
    grid.innerHTML = "";

    if (!list || list.length === 0) {
      grid.innerHTML = "<p>Aucun produit trouvé.</p>";
      return;
    }

    list.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("conteneur-product");

      const isFavorite = favoris.some(f => f.nom === p.nom && f.image === p.image);

      div.innerHTML = `
        <div class="favorite-icon">
          <img src="../Images/Icones/${isFavorite ? 'star-full.png' : 'star-empty.png'}" alt="favori">
        </div>
        <div class="cart-icon" role="button" aria-label="Ajouter au panier">+</div>
        ${p.isNew ? `<div class="New-Text">New</div>` : ""}
        <img src="${p.image}" alt="${p.nom}">
        <div class="Price-Text">${p.prix}$</div>
      `;

      const favIcon = div.querySelector(".favorite-icon");
      favIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const index = favoris.findIndex(f => f.nom === p.nom && f.image === p.image);
        if (index === -1) {
          favoris.push(p);
          favIcon.querySelector("img").src = "../Images/Icones/star-full.png";
        } else {
          favoris.splice(index, 1);
          favIcon.querySelector("img").src = "../Images/Icones/star-empty.png";
        }

        localStorage.setItem("favoris", JSON.stringify(favoris));
        updateFavorisCount();
      });

      const cartIcon = div.querySelector(".cart-icon");
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const index = cart.findIndex(item => item.nom === p.nom && item.image === p.image);
        if (index === -1) {
          cart.push({ ...p, quantity: 1 });
        } else {
          cart[index].quantity += 1;
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        cartIcon.classList.add("added");
        setTimeout(() => cartIcon.classList.remove("added"), 600);
      });

      grid.appendChild(div);
    });
  }

  // --- 7️⃣ Filtrer et trier les produits
  function applyFilters() {
    let filtered = produits;

    if (genderSelect) {
      const g = genderSelect.value.toLowerCase();
      if (g !== "all") filtered = filtered.filter(p => p.category.toLowerCase() === g);
    }
    if (colorSelect) {
      const c = colorSelect.value.toLowerCase();
      if (c !== "all") filtered = filtered.filter(p => p.couleur.toLowerCase() === c);
    }
    if (sizeSelect) {
      const s = sizeSelect.value.toLowerCase();
      if (s !== "all") filtered = filtered.filter(p => p.size.toLowerCase() === s);
    }
    if (sortSelect) {
      const sort = sortSelect.value.toLowerCase();
      if (sort.includes("high")) filtered.sort((a, b) => b.prix - a.prix);
      else if (sort.includes("low")) filtered.sort((a, b) => a.prix - b.prix);
      else if (sort.includes("new")) filtered = filtered.filter(p => p.isNew);
    }

    displayProducts(filtered);
  }

  // --- 8️⃣ Pré-filtre selon l'URL
  function mapUrlCategoryToData(cat) {
    if (!cat) return null;
    cat = cat.toLowerCase();
    if (cat === "homme" || cat === "male") return "male";
    if (cat === "femme" || cat === "female") return "female";
    return null;
  }

  const mapped = mapUrlCategoryToData(urlCategory);
  if (mapped && genderSelect) genderSelect.value = mapped;

  // --- 9️⃣ Initialisation
  updateFavorisCount();
  updateCartCount();
  applyFilters();

  // --- 10️⃣ Écouter les changements de filtres
  [genderSelect, colorSelect, sizeSelect, sortSelect].forEach(el => {
    if (el) el.addEventListener("change", applyFilters);
  });

});

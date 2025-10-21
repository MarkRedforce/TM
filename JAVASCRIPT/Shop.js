// 1️⃣ Lire le paramètre de catégorie depuis l'URL (?category=homme ou ?category=femme)
const params = new URLSearchParams(window.location.search);
const urlCategory = params.get("category"); // "homme" ou "femme"

// 2️⃣ Initialiser la liste des produits PARTIE Homework Tyler JS
localStorage.removeItem("allProducts"); // supprimer les anciennes données
let produits = JSON.parse(localStorage.getItem("allProducts")) || [
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

// 3️⃣ Sélectionner les éléments HTML
const grid = document.getElementById("productGrid");
const genderSelect = document.getElementById("Gender");
const colorSelect = document.getElementById("Color");
const sizeSelect = document.getElementById("Size");
const sortSelect = document.getElementById("Sort");

// Charger favoris et panier depuis localStorage
let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 4️⃣ Mettre à jour le compteur de favoris
function updateFavorisCount() {
  const countSpan = document.getElementById("favorisCount");
  if (!countSpan) return;
  countSpan.textContent = favoris.length;
  countSpan.style.visibility = favoris.length > 0 ? "visible" : "hidden";
}

// 5️⃣ Mettre à jour le compteur du panier
function updateCartCount() {
  const countSpan = document.getElementById("cartCount");
  if (!countSpan) return;
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  countSpan.textContent = total;
  countSpan.style.visibility = total > 0 ? "visible" : "hidden";
}

updateFavorisCount();
updateCartCount();

// 6️⃣ Afficher les produits sur la page
function displayProducts(list) {
  if (!grid) return;
  grid.innerHTML = ""; // vider la grille avant d'ajouter

  if (!list || list.length === 0) {
    grid.innerHTML = "<p>Aucun produit trouvé.</p>";
    return;
  }

  list.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("conteneur-product");

    // Vérifier si le produit est dans les favoris
    const isFavorite = favoris.some(f => f.nom === p.nom && f.image === p.image);

    // Ajouter le contenu HTML
    div.innerHTML = `
      <div class="favorite-icon ${isFavorite ? 'active' : ''}">
        <img src="../Images/Icones/star.png" alt="favori">
      </div>

      <div class="cart-icon" role="button" aria-label="Ajouter au panier">+</div>

      ${p.isNew ? `<div class="New-Text">New</div>` : ""}
      <img src="${p.image}" alt="${p.nom}">
      <div class="Price-Text">${p.prix}$</div>`;

    // Cliquer sur le favori
    const favIcon = div.querySelector(".favorite-icon");
    favIcon.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const index = favoris.findIndex(f => f.nom === p.nom && f.image === p.image);
      if (index === -1) {
        favoris.push(p);
        favIcon.classList.add("active");
      } else {
        favoris.splice(index, 1);
        favIcon.classList.remove("active");
      }

      localStorage.setItem("favoris", JSON.stringify(favoris));
      updateFavorisCount();
    });

    // Cliquer sur le panier
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

      // animation du bouton + 
      cartIcon.classList.add("added");
      setTimeout(() => cartIcon.classList.remove("added"), 600);
    });

    grid.appendChild(div);
  });
}

// 7️⃣ Filtrer et trier les produits
function applyFilters() {
  if (!genderSelect || !colorSelect || !sizeSelect || !sortSelect) {
    displayProducts(produits);
    return;
  }

  const selectedGender = (genderSelect.value || "all").toLowerCase();
  const selectedColor = (colorSelect.value || "all").toLowerCase();
  const selectedSize = (sizeSelect.value || "all").toLowerCase();
  const selectedSort = (sortSelect.value || "").toLowerCase();

  let filtered = produits.filter(p => {
    const genderMatch = selectedGender === "all" || (p.category && p.category.toLowerCase() === selectedGender);
    const colorMatch = selectedColor === "all" || (p.couleur && p.couleur.toLowerCase() === selectedColor);
    const sizeMatch = selectedSize === "all" || (p.size && p.size.toLowerCase() === selectedSize);
    return genderMatch && colorMatch && sizeMatch;
  });

  // Trier selon le choix
  if (selectedSort.includes("high")) filtered.sort((a, b) => b.prix - a.prix);
  else if (selectedSort.includes("low")) filtered.sort((a, b) => a.prix - b.prix);
  else if (selectedSort.includes("new")) filtered = filtered.filter(p => p.isNew);

  displayProducts(filtered);
}

// 8️⃣ Pré-filtre selon l'URL
function mapUrlCategoryToData(cat) {
  if (!cat) return null;
  cat = cat.toLowerCase();
  if (cat === "homme" || cat === "male") return "male";
  if (cat === "femme" || cat === "female") return "female";
  return null;
}

const mapped = mapUrlCategoryToData(urlCategory);
if (mapped && genderSelect) {
  genderSelect.value = mapped;
}

applyFilters(); // afficher les produits

// 9️⃣ Écouter les changements de filtres
if (genderSelect) genderSelect.addEventListener("change", applyFilters);
if (colorSelect) colorSelect.addEventListener("change", applyFilters);
if (sizeSelect) sizeSelect.addEventListener("change", applyFilters);
if (sortSelect) sortSelect.addEventListener("change", applyFilters);

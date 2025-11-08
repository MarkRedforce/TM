// Favoris.js
// --- Wait until DOM is ready to avoid "null" errors ---
document.addEventListener("DOMContentLoaded", function() {

  // --- Utility: read favorites from localStorage ---
  function readFavoris() {
    try {
      return JSON.parse(localStorage.getItem("favoris")) || [];
    } catch (e) {
      console.error("Invalid favoris in localStorage:", e);
      return [];
    }
  }

  // --- Update the red badge with the number of favorites ---
  function updateFavorisCount() {
    const favoris = readFavoris();
    const countSpan = document.getElementById("favorisCount");
    if (!countSpan) return;
    countSpan.textContent = favoris.length;
    countSpan.style.visibility = favoris.length > 0 ? "visible" : "hidden";
  }

  // --- Display a list of favorite items inside #favorisGrid ---
  function displayFavoris(list) {
    const grid = document.getElementById("favorisGrid");
    if (!grid) {
      console.warn("#favorisGrid not found");
      return;
    }

    function readCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("Cart storage corrupted:", e);
      return [];
    }
  }

  // --- Update the red bubble with number of items ---
  function updateCartCount() {
    const cart = readCart();
    const countSpan = document.getElementById("cartCount");
    if (!countSpan) return;

    countSpan.textContent = cart.length;
    countSpan.style.visibility = cart.length > 0 ? "visible" : "hidden";
  }

  // Call this once on page load
  updateCartCount();

  // 👇 Export for other scripts (so adding to cart updates badge immediately)
  window.updateCartCount = updateCartCount;

    grid.innerHTML = ""; // clear the grid

    if (!list || list.length === 0) {
      grid.innerHTML = "<p class='empty-text'>Aucun produit favori pour l'instant.</p>";
      return;
    }

    list.forEach((p) => {
      // Create product card
      const card = document.createElement("div");
      card.className = "conteneur-product";

      card.innerHTML = `
        <div class="favorite-icon active" data-name="${escapeHtml(p.nom)}">
          <img src="../Images/Icones/star-empty.png" alt="favorite">
        </div>
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.nom)}">
        <div class="Price-Text">${escapeHtml(p.prix)}$</div>
      `;

      // Remove favorite on star click
      const favIcon = card.querySelector(".favorite-icon");
      favIcon.addEventListener("click", () => {
        let current = readFavoris();
        current = current.filter(item => item.nom !== p.nom);
        localStorage.setItem("favoris", JSON.stringify(current));
        updateFavorisCount();
        displayFavoris(current); // re-render filtered list
      });

      grid.appendChild(card);
    });
  }

  // --- Simple HTML escape to prevent injection if data is untrusted ---
  function escapeHtml(str) {
    if (str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // --- Filter logic applied to the favorites array ---
  function applyFilters() {
    const favoris = readFavoris();
    const genderSelect = document.getElementById("filter-gender");
    const colorSelect = document.getElementById("filter-color");
    const sizeSelect = document.getElementById("filter-size");
    const sortSelect = document.getElementById("filter-sort");

    let filtered = Array.from(favoris);

    // Read selected values (use 'all' as default)
    const selectedGender = genderSelect ? (genderSelect.value || "all").toLowerCase() : "all";
    const selectedColor = colorSelect ? (colorSelect.value || "all").toLowerCase() : "all";
    const selectedSize = sizeSelect ? (sizeSelect.value || "all").toLowerCase() : "all";
    const selectedSort = sortSelect ? (sortSelect.value || "").toLowerCase() : "";

    // Filter by category/color/size if those properties exist on items
    filtered = filtered.filter(p => {
      const genderOK = selectedGender === "all" || (p.category && p.category.toLowerCase() === selectedGender);
      const colorOK = selectedColor === "all" || (p.couleur && p.couleur.toLowerCase() === selectedColor);
      const sizeOK = selectedSize === "all" || (p.size && p.size.toLowerCase() === selectedSize);
      return genderOK && colorOK && sizeOK;
    });

    // Sorting
    if (selectedSort.includes("high")) filtered.sort((a, b) => (b.prix || 0) - (a.prix || 0));
    else if (selectedSort.includes("low")) filtered.sort((a, b) => (a.prix || 0) - (b.prix || 0));
    else if (selectedSort.includes("new")) filtered = filtered.filter(p => p.isNew);

    // Render the filtered favorites
    displayFavoris(filtered);
  }

  // --- Attach listeners to filters (if they exist) ---
  ["filter-gender", "filter-color", "filter-size", "filter-sort"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", applyFilters);
  });

  // --- Initial render on page load ---
  updateFavorisCount();
  applyFilters(); // this will read localStorage and display items

}); // end DOMContentLoaded

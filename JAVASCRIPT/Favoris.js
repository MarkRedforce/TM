// --- 1️⃣ Met à jour le compteur des favoris (le petit cercle rouge avec le nombre) ---
function updateFavorisCount() {
  const favoris = JSON.parse(localStorage.getItem("favoris")) || [] // récupérer les favoris
  const countSpan = document.getElementById("favorisCount") // span où afficher le nombre

  if (!countSpan) return // si le span n'existe pas, arrêter

  countSpan.textContent = favoris.length // mettre le nombre
  countSpan.style.visibility = favoris.length > 0 ? "visible" : "hidden" // cacher si zéro
}

// --- Appeler au chargement de la page ---
updateFavorisCount()


// --- 2️⃣ Récupérer le conteneur où afficher les produits favoris ---
const favorisGrid = document.getElementById("favorisGrid")
const favoris = JSON.parse(localStorage.getItem("favoris")) || []

// --- 3️⃣ Vérifier si le conteneur existe et s'il y a des favoris ---
if (!favorisGrid) {
  console.warn("⚠️ Élément #favorisGrid non trouvé sur la page.")
} else if (favoris.length === 0) {
  favorisGrid.innerHTML = "<p class='empty-text'>Aucun produit favori pour l'instant.</p>"
} else {
  // --- 4️⃣ Créer une carte pour chaque produit favori ---
  favoris.forEach((p, index) => {
    const div = document.createElement("div")
    div.classList.add("conteneur-product")

    div.innerHTML = `
      <div class="favorite-icon active" data-index="${index}">
        <img src="../Images/Icones/star.png" alt="favorite">
      </div>

      <img src="${p.image}" alt="${p.nom}">
      <div class="Price-Text">${p.prix}$</div>
    `

    // --- 5️⃣ Ajouter le clic pour retirer des favoris directement depuis la page ---
    const favIcon = div.querySelector(".favorite-icon")
    favIcon.addEventListener("click", () => {
      // 1. Récupérer les favoris actuels
      const updatedFavoris = JSON.parse(localStorage.getItem("favoris")) || []
      // 2. Filtrer pour retirer le produit actuel
      const newList = updatedFavoris.filter(f => f.nom !== p.nom)

      // 3. Mettre à jour le localStorage et retirer la carte du DOM
      localStorage.setItem("favoris", JSON.stringify(newList))
      div.remove()
      updateFavorisCount()

      // 4. Si plus aucun produit favori, afficher un message
      if (newList.length === 0) {
        favorisGrid.innerHTML = "<p class='empty-text'>Aucun produit favori pour l'instant.</p>"
      }
    })

    // --- 6️⃣ Ajouter la carte dans la grille ---
    favorisGrid.appendChild(div)
  })
}
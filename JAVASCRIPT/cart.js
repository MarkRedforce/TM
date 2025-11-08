// ======================
//   ЗАГРУЗКА ДАННЫХ
// ======================
let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ======================
//   ОБНОВЛЕНИЕ СЧЕТЧИКОВ
// ======================

// Обновить счетчик избранных
function updateFavorisCount() {
  const countSpan = document.getElementById("favorisCount");
  if (!countSpan) return;
  countSpan.textContent = favoris.length;
  countSpan.style.visibility = favoris.length > 0 ? "visible" : "hidden";
}

// Обновить счетчик корзины
function updateCartCount() {
  const countSpan = document.getElementById("cartCount");
  if (!countSpan) return;

  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  countSpan.textContent = total;
  countSpan.style.visibility = total > 0 ? "visible" : "hidden";
}

// Вызываем при загрузке страницы
updateFavorisCount();
updateCartCount();


// ======================
//   ОТРИСОВКА КОРЗИНЫ
// ======================
const cartContainer = document.querySelector(".cart-list");

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Votre panier est vide.</p>";
    updateTotal();
    updateCartCount();
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

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

    const minusBtn = div.querySelector(".minus");
    const plusBtn = div.querySelector(".plus");

    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        if (confirm("Supprimer ce produit du panier ?")) {
          cart = cart.filter(p => p !== item);
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });

    plusBtn.addEventListener("click", () => {
      item.quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });

    cartContainer.appendChild(div);
  });

  updateTotal();
  updateCartCount();
}


// ======================
//   ПОДСЧЁТ ТОЛАЛА
// ======================
function updateTotal() {
  let total = 0;

  cart.forEach(item => {
    total += item.prix * item.quantity;
  });

  const totalElement = document.querySelector(".total span:last-child");
  if (totalElement) {
    totalElement.textContent = `€${total.toFixed(2)}`;
  }
}


// ======================
//   ПЕРВИЧНЫЙ ЗАПУСК
// ======================
renderCart();
updateCartCount();
updateFavorisCount();

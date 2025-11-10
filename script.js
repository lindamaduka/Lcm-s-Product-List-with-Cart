const products = [
  {
    id: 1,
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
    images: {
      thumbnail: "images/image-waffle-thumbnail.jpg",
      mobile: "images/image-waffle-mobile.jpg",
      tablet: "images/image-waffle-tablet.jpg",
      desktop: "images/image-waffle-desktop.jpg",
    },
  },
  {
    id: 2,
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.0,
    images: {
      thumbnail: "images/image-creme-brulee-thumbnail.jpg",
      mobile: "images/image-creme-brulee-mobile.jpg",
      tablet: "images/image-creme-brulee-tablet.jpg",
      desktop: "images/image-creme-brulee-desktop.jpg",
    },
  },
  {
    id: 3,
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.0,
    images: {
      thumbnail: "images/image-macaron-thumbnail.jpg",
      mobile: "images/image-macaron-mobile.jpg",
      tablet: "images/image-macaron-tablet.jpg",
      desktop: "images/image-macaron-desktop.jpg",
    },
  },
  {
    id: 4,
    name: "Classic Tiramisu",
    category: "Tiramisu",
    price: 5.5,
    images: {
      thumbnail: "images/image-tiramisu-thumbnail.jpg",
      mobile: "images/image-tiramisu-mobile.jpg",
      tablet: "images/image-tiramisu-tablet.jpg",
      desktop: "images/image-tiramisu-desktop.jpg",
    },
  },
  {
    id: 5,
    name: "Pistachio Baklava",
    category: "Baklava",
    price: 4.0,
    images: {
      thumbnail: "images/image-baklava-thumbnail.jpg",
      mobile: "images/image-baklava-mobile.jpg",
      tablet: "images/image-baklava-tablet.jpg",
      desktop: "images/image-baklava-desktop.jpg",
    },
  },
  {
    id: 6,
    name: "Lemon Meringue Pie",
    category: "Pie",
    price: 5.0,
    images: {
      thumbnail: "images/image-meringue-thumbnail.jpg",
      mobile: "images/image-meringue-mobile.jpg",
      tablet: "images/image-meringue-tablet.jpg",
      desktop: "images/image-meringue-desktop.jpg",
    },
  },
  {
    id: 7,
    name: "Red Velvet Cake",
    category: "Cake",
    price: 4.5,
    images: {
      thumbnail: "images/image-cake-thumbnail.jpg",
      mobile: "images/image-cake-mobile.jpg",
      tablet: "images/image-cake-tablet.jpg",
      desktop: "images/image-cake-desktop.jpg",
    },
  },
  {
    id: 8,
    name: "Salted Caramel Brownie",
    category: "Brownie",
    price: 4.5,
    images: {
      thumbnail: "images/image-brownie-thumbnail.jpg",
      mobile: "images/image-brownie-mobile.jpg",
      tablet: "images/image-brownie-tablet.jpg",
      desktop: "images/image-brownie-desktop.jpg",
    },
  },
  {
    id: 9,
    name: "Vanilla Panna Cotta",
    category: "Panna Cotta",
    price: 6.5,
    images: {
      thumbnail: "images/image-panna-cotta-thumbnail.jpg",
      mobile: "images/image-panna-cotta-mobile.jpg",
      tablet: "images/image-panna-cotta-tablet.jpg",
      desktop: "images/image-panna-cotta-desktop.jpg",
    },
  },
];

function saveCartToStorage() {
  try {
    localStorage.setItem("dessertCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem("dessertCart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    cart = [];
  }
}

let cart = [];
let currentCategory = "all";
let searchTerm = "";

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (n) => `$${n.toFixed(2)}`;

const cartCount = $("#aside-cart-count");

function findCartItem(productId) {
  return cart.find((i) => i.id === productId);
}
function cartButtonForProduct(id) {
  return document.querySelector(`.cart-button[data-id="${id}"]`);
}

function displayProducts() {
  const grid = $("#products");
  grid.innerHTML = "";

  const visible = products.filter((p) => {
    const byCat = currentCategory === "all" || p.category === currentCategory;
    const byText = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return byCat && byText;
  });

  if (!visible.length) {
    grid.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }

  visible.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="img-wrap">
        <picture>
          <source media="(min-width:1024px)" srcset="${product.images.desktop}">
          <source media="(min-width:600px)"  srcset="${product.images.tablet}">
          <img src="${product.images.mobile}" alt="${
      product.name
    }" loading="lazy">
        </picture>

        <div class="cart-button" data-id="${
          product.id
        }" aria-pressed="false" role="button" tabindex="0">
          <img class="icon" src="images/icon-add-to-cart.svg" alt="">
          <span class="label-default">Add to Cart</span>
          <span class="qty-wrap" hidden>
            <button class="qty-btn qty-minus" aria-label="Decrease">
              <img class="icon" src="images/icon-decrement-quantity.svg" alt="">
            </button>
            <span class="qty">1</span>
            <button class="qty-btn qty-plus" aria-label="Increase">
              <img class="icon" src="images/icon-increment-quantity.svg" alt="">
            </button>
          </span>
        </div>
      </div>

      <p class="category">${product.category}</p>
      <h3>${product.name}</h3>
      <strong class="price">${money(product.price)}</strong>
    `;
    grid.appendChild(card);
  });

  cart.forEach(({ id, qty }) => {
    const btn = cartButtonForProduct(id);
    if (btn) showQtyOnButton(btn, qty);
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let item = findCartItem(productId);
  if (item) {
    item.qty += 1;
  } else {
    item = { ...product, qty: 1 };
    cart.push(item);
  }

  const btn = cartButtonForProduct(productId);
  if (btn) showQtyOnButton(btn, item.qty);

  updateCartDisplay();
  saveCartToStorage(); // SAVE TO LOCALSTORAGE
}

function increaseQuantity(productId) {
  const item = findCartItem(productId);
  if (!item) return;
  item.qty += 1;

  const btn = cartButtonForProduct(productId);
  if (btn) btn.querySelector(".qty").textContent = item.qty;

  updateCartDisplay();
  saveCartToStorage();
}

function decreaseQuantity(productId) {
  const item = findCartItem(productId);
  if (!item) return;

  item.qty -= 1;

  const btn = cartButtonForProduct(productId);
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== productId);
    if (btn) showAddLabelOnButton(btn);
  } else if (btn) {
    btn.querySelector(".qty").textContent = item.qty;
  }

  updateCartDisplay();
  saveCartToStorage();
}

function removeItem(productId) {
  const btn = cartButtonForProduct(productId);
  cart = cart.filter((i) => i.id !== productId);
  if (btn) showAddLabelOnButton(btn);
  updateCartDisplay();
  saveCartToStorage();
}

function showQtyOnButton(btn, qty) {
  btn.setAttribute("aria-pressed", "true");
  btn.querySelector(".label-default").hidden = true;
  btn.querySelector(".qty-wrap").hidden = false;
  btn.querySelector(".qty").textContent = qty;
  btn.closest(".card")?.classList.add("selected");
}
function showAddLabelOnButton(btn) {
  btn.setAttribute("aria-pressed", "false");
  btn.querySelector(".label-default").hidden = false;
  btn.querySelector(".qty-wrap").hidden = true;
  btn.closest(".card")?.classList.remove("selected");
}

function calculateTotal() {
  return cart.reduce((sum, i) => sum + i.qty * i.price, 0);
}

function showEmptyCart() {
  $("#cart-empty").style.display = "flex";
  $("#cart-items").style.display = "none";
}

function hideEmptyCart() {
  $("#cart-empty").style.display = "none";
  $("#cart-items").style.display = "block";
}

function updateCartDisplay() {
  if (cartCount) cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);

  const list = $("#cart-items");
  list.innerHTML = "";
  if (!cart.length) {
    showEmptyCart();
  } else {
    hideEmptyCart();
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.qty}× ${item.name}</span>
        <span>${money(item.qty * item.price)}</span>
        <button class="btn remove" data-id="${item.id}" aria-label="Remove ${
        item.name
      }">
          <img class="icon" src="images/icon-remove-item.svg" alt="">
        </button>
      `;
      list.appendChild(li);
    });
  }

  $("#cart-total").textContent = money(calculateTotal());
  const confirm = $("#btnConfirm");
  if (confirm) {
    confirm.disabled = cart.length === 0;
    confirm.style.opacity = cart.length === 0 ? 0.6 : 1;
    confirm.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
  }
}

function showModal() {
  if (!cart.length) return;
  const list = $("#order-details");
  list.innerHTML = "";

  cart.forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="order-line-left">
        <img class="order-thumb" src="${i.images.thumbnail}" alt="${i.name}">
        <div>
          <div class="order-title">${i.name}</div>
          <div class="order-meta"><b>${i.qty}x</b>&nbsp;&nbsp;@ ${money(
      i.price
    )}</div>
        </div>
      </div>
      <div class="order-line-right">${money(i.qty * i.price)}</div>
    `;
    list.appendChild(li);
  });

  $("#order-total").textContent = money(calculateTotal());
  $("#order-modal").classList.add("open");
}
function hideModal() {
  $("#order-modal").classList.remove("open");
}

document.addEventListener("click", (e) => {
  const filterBtn = e.target.closest(".filter-btn");
  if (filterBtn) {
    $$(".filter-btn").forEach((b) => b.classList.remove("active"));
    filterBtn.classList.add("active");
    currentCategory = filterBtn.dataset.category;
    displayProducts();
    return;
  }

  const addBtn = e.target.closest(".cart-button");
  if (addBtn && addBtn.getAttribute("aria-pressed") === "false") {
    addToCart(+addBtn.dataset.id);
    return;
  }

  if (e.target.closest(".qty-plus")) {
    const id = +e.target.closest(".cart-button").dataset.id;
    increaseQuantity(id);
    return;
  }
  if (e.target.closest(".qty-minus")) {
    const id = +e.target.closest(".cart-button").dataset.id;
    decreaseQuantity(id);
    return;
  }

  const removeBtn = e.target.closest("#cart-items .btn.remove");
  if (removeBtn) {
    removeItem(+removeBtn.dataset.id);
    return;
  }

  if (e.target.id === "btnConfirm") {
    showModal();
    return;
  }

  if (e.target.id === "btnStartOver") {
    hideModal();
    cart = [];
    $$(".cart-button[aria-pressed='true']").forEach(showAddLabelOnButton);
    updateCartDisplay();
    saveCartToStorage();
    return;
  }
});

document.addEventListener("keydown", (e) => {
  const pill = e.target.closest?.(".cart-button");
  if (
    pill &&
    (e.key === "Enter" || e.key === " ") &&
    pill.getAttribute("aria-pressed") === "false"
  ) {
    addToCart(+pill.dataset.id);
    e.preventDefault();
    return;
  }
  const plus = e.target.closest?.(".qty-plus");
  const minus = e.target.closest?.(".qty-minus");
  if (plus && (e.key === "Enter" || e.key === " ")) {
    increaseQuantity(+plus.closest(".cart-button").dataset.id);
    e.preventDefault();
  }
  if (minus && (e.key === "Enter" || e.key === " ")) {
    decreaseQuantity(+minus.closest(".cart-button").dataset.id);
    e.preventDefault();
  }
});

$("#searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  displayProducts();
});

$("#order-modal").addEventListener("click", (e) => {
  if (e.target.id === "order-modal") hideModal();
});

loadCartFromStorage();
displayProducts();
updateCartDisplay();

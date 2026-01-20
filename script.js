let cart = [];

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

console.log("Total products:", products.length);
console.log("First product:", products[0]);

const productsGrid = document.querySelector(".products-grid");
console.log("Products grid element:", productsGrid);

const cartEmpty = document.querySelector(".cart_empty");
console.log("Empty cart message:", cartEmpty);

const cartItemsList = document.querySelector(".cart_items");
console.log("Cart items list:", cartItemsList);

const cartSummary = document.querySelector(".cart_summary");

const totalAmount = document.getElementById("totalAmount");
console.log("Total amount display:", totalAmount);

const cartCount = document.getElementById("cartCount");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const orderModal = document.getElementById("orderModal");
const modalSummary = document.querySelector(".modal_summary");
const modalTotalAmount = document.getElementById("modalTotalAmount");
const newOrderBtn = document.getElementById("newOrderBtn");

function displayProducts() {
  productsGrid.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.className = "product-card";
    li.setAttribute("data-id", product.id);
    console.log(`Card created with ID: ${product.id}`);

    li.innerHTML = `
  <article class="product">
    <div class="product_image-wrapper">
      <img src="${product.images.desktop}" alt="${product.name}" class="product_image">

      <button type="button" class="product_add-btn" data-id="${product.id}">
        <img src="images/icon-add-to-cart.svg" alt="" class="cart-icon" />
        <span>Add to Cart</span>
      </button>

      <div class="quantity-controls">
        <button type="button" class="quantity-btn decrease-btn" data-id="${product.id}">
          <img src="images/icon-decrement-quantity.svg" alt="">
        </button>

        <span class="quantity-display">1</span>

        <button type="button" class="quantity-btn increase-btn" data-id="${product.id}">
          <img src="images/icon-increment-quantity.svg" alt="">
        </button>
      </div>
    </div>

    <div class="product_details">
      <p class="product_category">${product.category}</p>
      <h3 class="product_name">${product.name}</h3>
      <p class="product_price">$${product.price.toFixed(2)}</p>
    </div>
  </article>
`;
    productsGrid.appendChild(li);
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
  updateProductCards();
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartDisplay();
    updateProductCards();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartDisplay();
  updateProductCards();
}

function updateProductCards() {
  products.forEach((product) => {
    const card = document.querySelector(
      `.product-card[data-id="${product.id}"]`,
    );
    const cartItem = cart.find((item) => item.id === product.id);

    if (cartItem) {
      card.classList.add("in-cart");
      const qtyDisplay = card.querySelector(".quantity-display");
      if (qtyDisplay) qtyDisplay.textContent = cartItem.quantity;
    } else {
      card.classList.remove("in-cart");
    }
  });
}

function updateCartDisplay() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = itemCount;

  if (cart.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartItemsList.classList.add("hidden");
    cartSummary.classList.add("hidden");
    return;
  }

  cartEmpty.classList.add("hidden");
  cartItemsList.classList.remove("hidden");
  cartSummary.classList.remove("hidden");

  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <div class="cart-item-pricing">
                            <span class="cart-item-quantity">${item.quantity}x</span>
                            <span class="cart-item-unit-price">@ $${item.price.toFixed(2)}</span>
                            <span class="cart-item-total-price">$${itemTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}"><img src="images/icon-remove-item.svg"></button>
                `;
    cartItemsList.appendChild(li);
  });

  totalAmount.textContent = total.toFixed(2);
}

function showOrderConfirmation() {
  if (cart.length === 0) return;

  modalSummary.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "order-summary-item";
    div.innerHTML = `
                    <img src="${item.images.desktop}" alt="${item.name}" class="summary-item-image">
                    <div class="summary-item-details">
                        <p class="summary-item-name">${item.name}</p>
                        <div class="summary-item-pricing">
                            <span class="summary-item-qty">${item.quantity}x</span>
                            <span class="summary-item-price">@ $${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <span class="summary-item-total">$${itemTotal.toFixed(2)}</span>
                `;
    modalSummary.appendChild(div);
  });

  modalTotalAmount.textContent = total.toFixed(2);
  orderModal.classList.remove("hidden");
}

function startNewOrder() {
  cart = [];
  updateCartDisplay();
  updateProductCards();
  orderModal.classList.add("hidden");
}

productsGrid.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".product_add-btn");
  const increaseBtn = e.target.closest(".increase-btn");
  const decreaseBtn = e.target.closest(".decrease-btn");

  if (addBtn) {
    const productId = parseInt(addBtn.dataset.id);
    addToCart(productId);
  } else if (increaseBtn) {
    const productId = parseInt(increaseBtn.dataset.id);
    updateQuantity(productId, 1);
  } else if (decreaseBtn) {
    const productId = parseInt(decreaseBtn.dataset.id);
    updateQuantity(productId, -1);
  }
});

cartItemsList.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".cart-item-remove");
  if (removeBtn) {
    const productId = parseInt(removeBtn.dataset.id);
    removeFromCart(productId);
  }
});

confirmOrderBtn.addEventListener("click", showOrderConfirmation);
newOrderBtn.addEventListener("click", startNewOrder);
orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.add("hidden");
  }
});

displayProducts();
updateCartDisplay();

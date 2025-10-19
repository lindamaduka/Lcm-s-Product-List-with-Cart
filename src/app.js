let products = [
  {
    id: 1,
    image: "images/image-waffle-desktop.jpg",
    name: "Waffle with Berries",
    category: "Waffle",
    price: 6.5,
  },
  {
    id: 2,
    image: "images/image-creme-brulee-desktop.jpg",
    name: "Vanilla Bean Crème Brûlée",
    category: "Crème Brûlée",
    price: 7.0,
  },
  {
    id: 3,
    image: "images/image-macaron-desktop.jpg",
    name: "Macaron Mix of Five",
    category: "Macaron",
    price: 8.0,
  },
  {
    id: 4,
    image: "images/image-tiramisu-desktop.jpg",
    name: "Classic Tiramisu",
    category: "Tiramisu",
    price: 5.5,
  },
  {
    id: 5,
    image: "images/image-baklava-desktop.jpg",
    name: "Pistachio Baklava",
    category: "Baklava",
    price: 4.0,
  },
  {
    id: 6,
    image: "images/image-meringue-desktop.jpg",
    name: "Lemon Meringue Pie",
    category: "Pie",
    price: 5.0,
  },
  {
    id: 7,
    image: "images/image-cake-desktop.jpg",
    name: "Red Velvet Cake",
    category: "Cake",
    price: 4.5,
  },
  {
    id: 8,
    image: "images/image-brownie-desktop.jpg",
    name: "Salted Caramel Brownie",
    category: "Brownie",
    price: 4.5,
  },
  {
    id: 9,
    image: "images/image-panna-cotta-desktop.jpg",
    name: "Vanilla Panna Cotta",
    category: "Panna Cotta",
    price: 6.5,
  },
];

const cart = [];
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const money = (n) => `$${n.toFixed(2)}`;

function headerCount() {
  return (
    document.getElementById("item-count") ||
    document.querySelector('[id="item -count"]')
  );
}

const modalLayout = $("#order-modal");

function renderProductsGrid() {
  const grid = $("#products");
  products.forEach((p) => {
    grid.appendChild(createProductCard(p));
  });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="img-wrap">
      <img src="${product.image}" alt="${product.name}">
      <div class="btn cart-button" data-id="${
        product.id
      }" aria-pressed="false" role="button" tabindex="0">
        <svg class="icon cart"><use href="#icon-add-to-cart"></use></svg>
        <span class="label-default">Add&nbsp;to&nbsp;Cart</span>
        <span class="qty-wrap" hidden>
          <button class="qty-minus" aria-label="Decrease">
            <svg class="icon"><use href="#icon-decrement-quantity"></use></svg>
          </button>
          <span class="qty">1</span>
          <button class="qty-plus" aria-label="Increase">
            <svg class="icon"><use href="#icon-increment-quantity"></use></svg>
          </button>
        </span>
      </div>
    </div>
    <p class="category">${product.category}</p>
    <h3>${product.name}</h3>
    <strong class="price">${money(product.price)}</strong>
  `;
  return card;
}

function switchCartButtons() {
  document.querySelectorAll(".btn.cart-button").forEach((btn) => {
    btn.setAttribute("aria-pressed", "false");
    const label = btn.querySelector(".label-default");
    const qtyWrap = btn.querySelector(".qty-wrap");
    if (label) label.hidden = false;
    if (qtyWrap) qtyWrap.hidden = true;
    btn.closest(".card")?.classList.remove("selected");
  });
}

function cartButtonForProduct(id) {
  return document.querySelector(`.btn.cart-button[data-id="${id}"]`);
}

function showQtyOnCartButton(btn, qty) {
  btn.setAttribute("aria-pressed", "true");
  btn.querySelector(".label-default").hidden = true;
  btn.querySelector(".qty-wrap").hidden = false;
  btn.querySelector(".qty").textContent = qty;
  btn.closest(".card").classList.add("selected");
}

function showAddOnCartButton(btn) {
  btn.setAttribute("aria-pressed", "false");
  btn.querySelector(".label-default").hidden = false;
  btn.querySelector(".qty-wrap").hidden = true;
  btn.closest(".card").classList.remove("selected");
}

function findCartItem(id) {
  return cart.find((i) => i.id === id);
}
function totalQuantity() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function totalAmount() {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function updateCartCounts() {
  const header = headerCount();
  if (header) header.textContent = totalQuantity();
  $("#cart-count-aside").textContent = totalQuantity();
}

function renderCartList() {
  const list = $("#cart-items");
  list.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.qty}× ${item.name}</span>
      <span>${money(item.qty * item.price)}</span>
      <button class="btn remove" data-index="${index}" aria-label="Remove ${
      item.name
    }">
        <svg class="icon"><use href="#icon-remove-item"></use></svg>
      </button>
    `;
    list.appendChild(li);
  });
}

function renderCartTotals() {
  $("#cart-total").textContent = money(totalAmount());
}

function renderCart() {
  updateCartCounts();
  renderCartList();
  renderCartTotals();
}

function addItem(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  let item = findCartItem(id);
  if (item) {
    item.qty += 1;
  } else {
    item = { ...product, qty: 1 };
    cart.push(item);
  }

  const btn = cartButtonForProduct(id);
  if (btn) showQtyOnCartButton(btn, item.qty);

  renderCart();
}

function changeItemQty(id, step) {
  const item = findCartItem(id);
  if (!item) return;

  item.qty += step;

  const btn = cartButtonForProduct(id);

  if (item.qty <= 0) {
    cart.splice(cart.indexOf(item), 1);
    if (btn) showAddOnCartButton(btn);
  } else if (btn) {
    btn.querySelector(".qty").textContent = item.qty;
  }

  renderCart();
}

function removeItemByIndex(index) {
  const [removed] = cart.splice(index, 1);
  if (removed) {
    const btn = cartButtonForProduct(removed.id);
    if (btn) showAddOnCartButton(btn);
  }
  renderCart();
}

function resetCart() {
  cart.length = 0;
  $$(".card.selected").forEach((c) => c.classList.remove("selected"));
  $$(".btn.cart-button").forEach((btn) => showAddOnCartButton(btn));
  renderCart();
}

function orderSummary() {
  const list = $("#order-details");
  list.innerHTML = "";

  cart.forEach((i) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${i.qty}× ${i.name}</span><span>${money(
      i.qty * i.price
    )}</span>`;
    list.appendChild(li);
  });

  $("#order-total").textContent = money(totalAmount());
}

function openOrderModal() {
  if (!cart.length) return;
  orderSummary();
  modalLayout.classList.add("open");
}

function closeOrderModal() {
  modalLayout.classList.remove("open");
}

document.addEventListener("click", (e) => {
  const plus = e.target.closest(".qty-plus");
  if (plus) {
    const id = +plus.closest(".cart-button").dataset.id;
    changeItemQty(id, +1);
    return;
  }

  const minus = e.target.closest(".qty-minus");
  if (minus) {
    const id = +minus.closest(".cart-button").dataset.id;
    changeItemQty(id, -1);
    return;
  }

  const removeBtn = e.target.closest("#cart-items .btn.remove");
  if (removeBtn) {
    removeItemByIndex(+removeBtn.dataset.index);
    return;
  }

  const btn = e.target.closest(".btn.cart-button");
  if (btn && btn.getAttribute("aria-pressed") === "false") {
    addItem(+btn.dataset.id);
  }
});

document.addEventListener("keydown", (e) => {
  const btn = e.target.closest?.(".btn.cart-button");
  if (!btn) return;

  if (
    (e.key === "Enter" || e.key === " ") &&
    btn.getAttribute("aria-pressed") === "false"
  ) {
    addItem(+btn.dataset.id);
    e.preventDefault();
  }
});

$("#btnNewOrder").addEventListener("click", resetCart);
$("#btnConfirm").addEventListener("click", openOrderModal);
$("#btnStartOver").addEventListener("click", () => {
  closeOrderModal();
  resetCart();
});

renderProductsGrid();
switchCartButtons();
renderCart();

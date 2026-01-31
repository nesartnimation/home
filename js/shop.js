// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; // guardar productos desde JSON

// =======================
// CARRITO: solo contador
// =======================
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Carrito siempre clicable, lleva a checkout
document.getElementById('cart').addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products) {
  shop.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="${product.link}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
    `;

    shop.appendChild(div);
  });
}

// =======================
// FILTRO CATEGORÍAS
// =======================
function filterCategory(category) {
  if (category === 'all') {
    renderProducts(allProducts.slice(0, 4)); // productos destacados
  } else {
    renderProducts(allProducts.filter(p => p.category === category));
  }
}

// =======================
// CARGA JSON
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products.slice(0, 4)); // inicio = destacados
    updateCartCount();
  })
  .catch(err => console.error('Error cargando productos:', err));

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});

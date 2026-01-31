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
// CARRITO
// =======================
function updateCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
      cartItems.appendChild(li);
    });
  }

  // Mostrar total si existe
  if (cart.length > 0 && cartTotal) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: ${total}€`;
  }

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// RENDER PRODUCTOS (TIENDA Y CATEGORÍAS)
// =======================
function renderProducts(products) {
  if (!shop) return; // evita error si no hay sección shop

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
// FILTRO POR CATEGORÍAS
// =======================
function filterCategory(category) {
  if (category === 'all') {
    renderProducts(allProducts);
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
    renderProducts(products); // mostrar todos inicialmente
    updateCart();
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

// =======================
// ACCESO AL CHECKOUT DESDE EL CARRITO
// =======================
const cartContainer = document.getElementById('cart');
if (cartContainer) {
  cartContainer.addEventListener('click', () => {
    if (cart.length === 0) {
      // Mensaje dentro del dropdown
      cartEmpty.textContent = 'Todavía no has puesto nada en tu carrito';
      cartEmpty.style.display = 'block';
      return; // no redirigir
    }
    window.location.href = 'checkout.html';
  });
}

// =======================
// ACTUALIZAR CARRITO AL INICIO
// =======================
updateCart();


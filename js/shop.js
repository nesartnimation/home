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
// FUNCIONES
// =======================

// Actualiza carrito
function updateCart() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.name} - $${item.price} x ${item.quantity}
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      cartItems.appendChild(li);
    });
  }

  // Contador total
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;

  // Total precio
  if (cartTotal) {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${totalPrice}`;
  }

  // Guardar en localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Botones eliminar
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// Renderiza productos
function renderProducts(products) {
  shop.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="${product.link}" class="product-link">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <button class="overlay-button add-to-cart" 
          data-id="${product.id}" 
          data-name="${product.name}" 
          data-price="${product.price}">
          Añadir al carrito
        </button>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
    `;
    shop.appendChild(div);
  });

  // Botones añadir al carrito
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }
      updateCart();
    });
  });
}

// Filtrar productos por categoría
function filterByCategory(category) {
  if (!category || category === 'all') {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
  }
}

// =======================
// CARGAR PRODUCTOS DESDE JSON
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products;

      // =======================
      // FILTRADO AUTOMÁTICO POR QUERY STRING
      // =======================
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      filterByCategory(category);
    })
    .catch(err => console.error('Error al cargar productos:', err));
}

// =======================
// INICIALIZACIÓN
// =======================
loadProducts();
updateCart();

// =======================
// EVENTOS SIDEBAR (CAMBIAR URL AL HACER CLICK)
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = link.getAttribute('data-category');
    // Cambia la URL y recarga la página filtrando
    window.location.href = `tienda.html?category=${cat}`;
  });
});

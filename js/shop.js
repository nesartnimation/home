// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartCount = document.getElementById('cart-count');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; // guardar productos desde JSON

// =======================
// FUNCIONES
// =======================

// Actualiza el contador del carrito y guarda en localStorage
function updateCartCount() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if(cartCount){
    cartCount.textContent = totalQuantity;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderizar productos (opcional filtrado por categoría)
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
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart" 
        data-id="${product.id}" 
        data-name="${product.name}" 
        data-price="${product.price}">
        Añadir al carrito
      </button>
    `;
    shop.appendChild(div);
  });

  // Añadir producto al carrito
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));

      const existing = cart.find(item => item.id === id);
      if(existing){
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      // Actualizar contador únicamente (sin popups)
      updateCartCount();
    });
  });
}

// Filtrado por categoría
function filterByCategory(category){
  if(category === 'all'){
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
      allProducts = products;       // guardamos todos
      renderProducts(allProducts);  // mostramos todos al inicio
      updateCartCount();            // actualizar contador inicial
    })
    .catch(err => console.error('Error al cargar productos:', err));
}

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const cat = link.getAttribute('data-category');
    filterByCategory(cat);
  });
});

// =======================
// INICIALIZACIÓN
// =======================
loadProducts();
updateCartCount();

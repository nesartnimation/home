// =======================
// VARIABLES GLOBALES
// =======================
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// FUNCIÓN PARA ACTUALIZAR CARRITO
// =======================
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

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;

  localStorage.setItem('cart', JSON.stringify(cart));

  if (cartTotal) {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${totalPrice}`;
  }

  // Botones de eliminar
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// =======================
// FUNCION PARA RENDERIZAR PRODUCTO EN UN CONTENEDOR
// =======================
function renderProduct(product, container) {
  const div = document.createElement('div');
  div.className = 'product';
  div.innerHTML = `
    <div class="product-image-wrapper">
      <a href="${product.link}" class="product-link">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <button class="overlay-button add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Añadir al carrito</button>
    </div>
    <h3>${product.name}</h3>
    <p>${product.price}€</p>
  `;
  container.appendChild(div);
}

// =======================
// CARGAR PRODUCTOS DESDE JSON
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(response => response.json())
    .then(products => {

      // Buscar todos los contenedores de categoría
      const categorySections = document.querySelectorAll('.shop-category');
      categorySections.forEach(section => {
        const category = section.getAttribute('data-category'); // ej: "prints"
        const container = section.querySelector('.shop');

        // Filtrar productos por categoría
        products
          .filter(product => product.category === category)
          .forEach(product => renderProduct(product, container));
      });

      // Botones añadir al carrito
      const addButtons = document.querySelectorAll('.add-to-cart');
      addButtons.forEach(button => {
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

          updateCart();
        });
      });

    })
    .catch(error => console.error('Error al cargar los productos:', error));
}

// =======================
// INICIALIZACIÓN
// =======================
loadProducts();
updateCart();

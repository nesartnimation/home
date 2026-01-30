// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.getElementById('shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');

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
      li.textContent = `${item.name} - ${item.price}€`;

      // Botón para eliminar del carrito
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '❌';
      removeBtn.style.marginLeft = '8px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart();
      });

      li.appendChild(removeBtn);
      cartItems.appendChild(li);
    });
  }

  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// FUNCION PARA CARGAR PRODUCTOS DESDE JSON
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar products.json");
      return response.json();
    })
    .then(products => {
      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';

        // Imagen con placeholder si falla
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        img.onerror = () => { img.src = 'images/placeholder.png'; }; // placeholder opcional

        const name = document.createElement('h3');
        name.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = `${product.price}€`;

        const button = document.createElement('button');
        button.className = 'add-to-cart';
        button.textContent = 'Añadir al carrito';
        button.addEventListener('click', () => {
          cart.push({ name: product.name, price: product.price });
          updateCart();
        });

        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(price);
        div.appendChild(button);

        shop.appendChild(div);
      });

      // ✅ Actualizar carrito después de cargar productos
      updateCart();
    })
    .catch(error => {
      console.error('Error al cargar los productos:', error);
      shop.innerHTML = '<p>Error cargando productos.</p>';
    });
}

// =======================
// INICIALIZACIÓN
// =======================
loadProducts();

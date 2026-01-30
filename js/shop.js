// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.getElementById('shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// ACTUALIZAR CARRITO
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

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'x';
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
// CARGAR PRODUCTOS
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar products.json');
      }
      return response.json();
    })
    .then(products => {
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product';

        // ---------- CONTENEDOR IMAGEN ----------
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-image-wrapper';

        // Link a página de producto
        const link = document.createElement('a');
        link.href = product.link || '#';
        link.className = 'product-link';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        img.onerror = () => {
          img.src = 'images/placeholder.png'; // opcional
        };

        link.appendChild(img);

        // Botón overlay
        const addButton = document.createElement('button');
        addButton.className = 'add-to-cart overlay-button';
        addButton.textContent = 'Añadir al carrito';

        addButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          cart.push({ name: product.name, price: product.price });
          updateCart();
        });

        imageWrapper.appendChild(link);
        imageWrapper.appendChild(addButton);

        // ---------- TEXTO ----------
        const title = document.createElement('h3');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = `${product.price}€`;

        // ---------- MONTAJE ----------
        productCard.appendChild(imageWrapper);
        productCard.appendChild(title);
        productCard.appendChild(price);

        shop.appendChild(productCard);
      });

      updateCart();
    })
    .catch(error => {
      console.error(error);
      shop.innerHTML = '<p>Error cargando productos.</p>';
    });
}

// =======================
// INIT
// =======================
loadProducts();

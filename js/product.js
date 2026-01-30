// Obtener ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const productName = document.getElementById('product-name');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const productImg = document.getElementById('product-img');
const addToCartBtn = document.getElementById('add-to-cart');

fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      productName.textContent = "Producto no encontrado";
      return;
    }

    productName.textContent = product.name;
    productDescription.textContent = product.description || "Sin descripción.";
    productPrice.textContent = `Precio: ${product.price}€`;
    productStock.textContent = `Stock: ${product.stock || "∞"}`;
    productImg.src = product.image;
    productImg.alt = product.name;

    addToCartBtn.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name: product.name, price: product.price });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Producto añadido al carrito');
      // Actualiza el contador (si usas shop.js)
      updateCart();
    });
  })
  .catch(err => console.error(err));

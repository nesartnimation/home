const gallery = document.getElementById('gallery');

const images = [
  {
    src: "images/Galeria/NesArt/obra1.jpg",
    title: "Obra 1"
  },
  {
    src: "images/Galeria/Comisiones/birds.png",
    title: "Obra 2"
  },
  {
    src: "images/Galeria/Originales/obra3.jpg",
    title: "Obra 3"
  }
];

images.forEach(item => {
  const figure = document.createElement('figure');
  figure.innerHTML = `
    <img src="${item.src}" alt="${item.title}">
    <figcaption>${item.title}</figcaption>
  `;
  gallery.appendChild(figure);
});

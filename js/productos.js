// Catálogo de productos de la tienda
const PRODUCTOS = [
  { id: 1,  nombre: "Portátil Pro 15\"",        categoria: "Ordenadores", precio: 899.00, icono: "💻", stock: 5 },
  { id: 2,  nombre: "Sobremesa Gaming",        categoria: "Ordenadores", precio: 1199.00, icono: "🖥️", stock: 3 },
  { id: 3,  nombre: "Teclado mecánico RGB",    categoria: "Periféricos", precio: 69.90, icono: "⌨️", stock: 20 },
  { id: 4,  nombre: "Ratón inalámbrico",       categoria: "Periféricos", precio: 24.99, icono: "🖱️", stock: 35 },
  { id: 5,  nombre: "Auriculares Bluetooth",   categoria: "Audio",       precio: 59.00, icono: "🎧", stock: 12 },
  { id: 6,  nombre: "Altavoz portátil",        categoria: "Audio",       precio: 39.95, icono: "🔊", stock: 8 },
  { id: 7,  nombre: "Smartphone X12",          categoria: "Móviles",     precio: 499.00, icono: "📱", stock: 10 },
  { id: 8,  nombre: "Smartwatch Fit",          categoria: "Móviles",     precio: 129.00, icono: "⌚", stock: 15 },
  { id: 9,  nombre: "Webcam Full HD",          categoria: "Periféricos", precio: 34.50, icono: "📷", stock: 0 },
  { id: 10, nombre: "Disco SSD 1 TB",          categoria: "Componentes", precio: 79.99, icono: "💾", stock: 25 },
  { id: 11, nombre: "Memoria RAM 16 GB",       categoria: "Componentes", precio: 45.00, icono: "🧩", stock: 18 },
  { id: 12, nombre: "Mando inalámbrico",       categoria: "Gaming",      precio: 49.90, icono: "🎮", stock: 9 }
];

if (typeof module !== "undefined") module.exports = { PRODUCTOS };

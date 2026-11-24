# 🛒 TecnoShop · Tienda online

Tienda web de productos tecnológicos hecha con **HTML, CSS y JavaScript** sin librerías.
Proyecto de **Lenguajes de Marcas** y **Desarrollo de Interfaces** (DAM).

🔗 **Demo:** https://felix-cm104.github.io/tienda/

## ✨ Funcionalidades

- Catálogo con búsqueda, filtro por categoría y ordenación por precio o nombre
- Carrito lateral: añadir, sumar o restar unidades y eliminar productos
- Control de stock (no deja añadir más unidades de las disponibles)
- Resumen con desglose de **IVA (21 %)** y **envío gratis desde 50 €**
- El carrito se guarda en **localStorage** y se mantiene al recargar la página
- Formulario de pedido con validación (email, teléfono, código postal…)
- Diseño adaptable a móvil (CSS Grid y Flexbox)

## 🧱 Estructura

```
index.html
css/styles.css
js/
├── productos.js   # Catálogo
├── carrito.js     # Lógica del carrito (sin dependencias del DOM)
└── app.js         # Interfaz y eventos
tests/carrito.test.js
```

## ▶️ Cómo ejecutarlo

Abre `index.html` en el navegador (o usa la extensión *Live Server* de VS Code).

Pruebas de la lógica del carrito (requiere Node.js 18+):

```bash
node --test tests/
```

## 🛠️ Tecnologías

HTML5 · CSS3 (Grid, Flexbox, variables) · JavaScript (ES6+, clases) · localStorage

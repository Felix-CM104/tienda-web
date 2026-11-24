// Pruebas de la lógica del carrito. Ejecutar con: node tests/carrito.test.js
const assert = require("node:assert");
const test = require("node:test");
const { PRODUCTOS } = require("../js/productos.js");
const { Carrito, ENVIO } = require("../js/carrito.js");

// Almacenamiento falso que imita a localStorage
function memoria() {
  const datos = {};
  return { getItem: k => datos[k] ?? null, setItem: (k, v) => (datos[k] = v) };
}

test("añadir productos acumula cantidades", () => {
  const c = new Carrito(PRODUCTOS);
  c.anadir(3);
  c.anadir(3);
  c.anadir(4);
  assert.strictEqual(c.numeroUnidades, 3);
  assert.strictEqual(c.items.length, 2);
});

test("no se puede superar el stock", () => {
  const c = new Carrito(PRODUCTOS);
  assert.throws(() => c.anadir(9), /Solo quedan 0/); // webcam agotada
  assert.throws(() => c.anadir(2, 4), /Solo quedan 3/);
});

test("envío gratis a partir de 50 €", () => {
  const c = new Carrito(PRODUCTOS);
  c.anadir(4); // 24,99
  assert.strictEqual(c.resumen.envio, ENVIO);
  assert.strictEqual(c.resumen.total, 29.94);
  c.anadir(4); // 49,98
  c.anadir(4); // 74,97
  assert.strictEqual(c.resumen.envio, 0);
  assert.strictEqual(c.resumen.total, 74.97);
});

test("desglose de IVA cuadra con el total", () => {
  const c = new Carrito(PRODUCTOS);
  c.anadir(1);
  const r = c.resumen;
  assert.strictEqual(Math.round((r.subtotal + r.iva) * 100) / 100, 899);
});

test("cantidad 0 elimina la línea", () => {
  const c = new Carrito(PRODUCTOS);
  c.anadir(5);
  c.cambiarCantidad(5, 0);
  assert.strictEqual(c.items.length, 0);
  assert.strictEqual(c.resumen.total, 0);
});

test("el carrito se guarda y se recupera", () => {
  const almacen = memoria();
  const c1 = new Carrito(PRODUCTOS, almacen);
  c1.anadir(7, 2);
  const c2 = new Carrito(PRODUCTOS, almacen);
  assert.strictEqual(c2.numeroUnidades, 2);
  assert.strictEqual(c2.items[0].nombre, "Smartphone X12");
});

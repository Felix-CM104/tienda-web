// Lógica del carrito, independiente del HTML para poder probarla (ver tests/carrito.test.js)

const IVA = 0.21;
const ENVIO = 4.95;
const ENVIO_GRATIS_DESDE = 50;

class Carrito {
  /**
   * @param {Array} productos catálogo disponible
   * @param {Storage|null} almacenamiento localStorage u otro objeto con getItem/setItem
   */
  constructor(productos, almacenamiento = null) {
    this.productos = productos;
    this.almacenamiento = almacenamiento;
    this.lineas = new Map(); // id -> cantidad
    this.cargar();
  }

  producto(id) {
    return this.productos.find(p => p.id === id);
  }

  anadir(id, cantidad = 1) {
    const p = this.producto(id);
    if (!p) throw new Error("Producto no encontrado");
    const nueva = (this.lineas.get(id) || 0) + cantidad;
    if (nueva > p.stock) throw new Error(`Solo quedan ${p.stock} unidades de ${p.nombre}`);
    this.lineas.set(id, nueva);
    this.guardar();
  }

  cambiarCantidad(id, cantidad) {
    if (cantidad <= 0) return this.quitar(id);
    const p = this.producto(id);
    if (cantidad > p.stock) throw new Error(`Solo quedan ${p.stock} unidades de ${p.nombre}`);
    this.lineas.set(id, cantidad);
    this.guardar();
  }

  quitar(id) {
    this.lineas.delete(id);
    this.guardar();
  }

  vaciar() {
    this.lineas.clear();
    this.guardar();
  }

  get items() {
    return [...this.lineas].map(([id, cantidad]) => {
      const p = this.producto(id);
      return { ...p, cantidad, importe: redondear(p.precio * cantidad) };
    });
  }

  get numeroUnidades() {
    let total = 0;
    this.lineas.forEach(c => (total += c));
    return total;
  }

  /** Los precios del catálogo incluyen IVA; se desglosa en el resumen. */
  get resumen() {
    const total_productos = redondear(this.items.reduce((s, i) => s + i.importe, 0));
    const subtotal = redondear(total_productos / (1 + IVA));
    const iva = redondear(total_productos - subtotal);
    const envio = total_productos === 0 || total_productos >= ENVIO_GRATIS_DESDE ? 0 : ENVIO;
    return { subtotal, iva, envio, total: redondear(total_productos + envio) };
  }

  guardar() {
    if (this.almacenamiento) {
      this.almacenamiento.setItem("carrito", JSON.stringify([...this.lineas]));
    }
  }

  cargar() {
    if (!this.almacenamiento) return;
    try {
      const datos = JSON.parse(this.almacenamiento.getItem("carrito") || "[]");
      // Solo se recuperan productos que sigan existiendo
      datos.filter(([id]) => this.producto(id)).forEach(([id, c]) => this.lineas.set(id, c));
    } catch {
      this.lineas.clear();
    }
  }
}

function redondear(n) {
  return Math.round(n * 100) / 100;
}

function formatoEuros(n) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

if (typeof module !== "undefined") module.exports = { Carrito, formatoEuros, ENVIO, ENVIO_GRATIS_DESDE };

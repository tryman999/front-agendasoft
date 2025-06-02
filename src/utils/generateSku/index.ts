/* eslint-disable @typescript-eslint/no-explicit-any */
export function generarSKU(
  idProducto: any,
  nombreProducto: string,
  proveedorId: any,
  categoriaId: any,
  marca: any
) {
  // Validar que los parámetros obligatorios estén presentes
  if (
    !idProducto ||
    !nombreProducto ||
    !proveedorId ||
    !categoriaId ||
    !marca
  ) {
    return `generando SKU...`;
  }

  // Obtener las iniciales del nombre del producto
  const palabras = nombreProducto.split(/\s+/); // Dividir por espacios
  let iniciales = "";
  for (const palabra of palabras) {
    if (palabra.length > 0) {
      iniciales += palabra.charAt(0).toUpperCase();
    }
  }

  // Construir el SKU
  const sku = `${idProducto}-${iniciales}-${proveedorId}-${categoriaId}-${marca}`;
  console.log(sku);
  return sku;
}

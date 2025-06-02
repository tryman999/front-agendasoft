/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useCartStore } from "../../utils/zustand/store/useCartStore";

export interface Product {
  categoria_id: number;
  codigo: string;
  descripcion: string;
  estado: string;
  image_url: string;
  marca: string;
  nombre_producto: string;
  precio_costo: string;
  precio_venta: string;
  producto_id: number;
  proveedor_id: number;
  stock: number;
  stock_minimo: number;
}

export const ProductDetails: React.FC<{ product: any }> = ({ product }) => {
  const addProduct = useCartStore((state) => state.addProduct);
  const [add, setAdd] = useState("");

  const handleAddProduct = (product: any) => {
    addProduct({ ...product, quantity: 1 });
    setAdd("Producto fue agregado");
    setTimeout(() => {
      setAdd("");
    }, 1000);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Detalle del Producto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.nombre_producto}
                className="w-full rounded-md shadow-md"
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {product.nombre_producto}
            </h3>
            <p className="text-gray-600 mb-4">{product.descripcion}</p>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Información:</p>
              <ul className="list-none space-y-2">
                <li>
                  <span className="font-medium text-gray-800">
                    Código: {product.codigo}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-800">
                    Marca: {product.marca}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-800">Estado:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      product.estado === "disponible"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {product.estado}
                  </span>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 font-semibold">Precios:</p>
              <ul className="list-none space-y-2">
                {/*<li>
                  <span className="font-medium text-gray-800">
                    Precio de Costo: $
                    {parseFloat(product.precio_costo).toLocaleString("es-CO")}
                  </span>
                </li> */}
                <li>
                  <span className="font-medium text-green-800">
                    Precio de Venta: $
                    {parseFloat(product.precio_venta).toLocaleString("es-CO")}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Inventario:</p>
              <ul className="list-none space-y-2">
                <li>
                  <span className="font-medium text-gray-800">
                    Stock Actual: {product.stock}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-800">
                    Stock Mínimo: {product.stock_minimo}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full py-4">
          <button
            onClick={() => handleAddProduct(product)}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar producto
          </button>
        </div>
        {add && <p className="text-gray-900">{add}</p>}
        <div className="mt-6 border-t pt-4 text-gray-500 text-sm">
          <p>
            <span className="font-medium">
              ID del Producto: {product.producto_id}
            </span>
          </p>
          <p>
            <span className="font-medium">
              ID de Categoría: {product.categoria_id}
            </span>
          </p>
          <p>
            <span className="font-medium">
              ID de Proveedor: {product.proveedor_id}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

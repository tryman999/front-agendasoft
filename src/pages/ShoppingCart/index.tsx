/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useCartStore } from "../../utils/zustand/store/useCartStore";
import Modal from "../../components/Modal";
import { FormVentas } from "../../components/formVentas";
import { NavLink } from "react-router";

const ShoppingCartPage: React.FC = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeProduct = useCartStore((state) => state.removeProduct); // Asumimos que tienes una función para remover
  const updateQuantity = useCartStore((state) => state.updateQuantity); // Asumimos una función para actualizar la cantidad
  const clearCart = useCartStore((state) => state.clearCart);

  const [clients, setClients] = useState<any>([]);
  const [auxiliar, setAuxiliar] = useState<any>([]);

  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<boolean>(false); // Estado para el ID del modal abierto

  const openModal = () => {
    setOpenModalId(!openModalId); // Establecer el ID del usuario cuyo modal debe abrirse
  };

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/usuarios`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();

      const filterAuxiliar = data.filter(
        (item: { rol_id: any }) => item.rol_id == 2
      );

      setAuxiliar(filterAuxiliar);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/clientes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();

      setClients(data);
    };
    getUsers();
  }, []);

  const handleRemove = (productId: number) => {
    removeProduct(productId);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.precio_venta * (item.quantity || 0),
      0
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-8 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold mb-4">Lista de compras</h2>
        <p className="text-gray-600">Está vacío.</p>
        <NavLink
          className="bg-blue-700 hover:bg-blue-500 text-white py-2 px-4 rounded font-semibold"
          to="/dashboard/products/shop"
        >
          Seguir Comprando
        </NavLink>
        {/* Opcional: Un enlace para volver a la página de productos */}
      </div>
    );
  }

  console.log({ clients, auxiliar });
  return (
    <div className="container mx-auto py-8">
      <Modal isOpen={openModalId} onClose={openModal}>
        <>
          <FormVentas
            clients={clients}
            auxiliaries={auxiliar}
            totalPrice={calculateTotalPrice()}
            products={cartItems}
          />
          {errorState && <p>{errorState}</p>}
        </>
      </Modal>
      <h2 className="text-2xl font-semibold mb-4">Tus compras</h2>
      <div className="shadow-md rounded-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-900">Producto</th>
              <th className="py-3 px-4 text-center text-gray-900">Precio</th>
              <th className="py-3 px-4 text-center text-gray-900">Cantidad</th>
              <th className="py-3 px-4 text-center text-gray-900">Total</th>
              <th className="py-3 px-4 text-right text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.producto_id} className="border-b">
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.nombre_producto}
                        className="w-12 h-12 object-cover rounded mr-2"
                      />
                    )}
                    <span>{item.nombre_producto}</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  ${parseInt(item.precio_venta).toLocaleString("es-CO")}
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity || 1}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (
                        !isNaN(newQuantity) &&
                        newQuantity >= 1 &&
                        newQuantity <= item.stock
                      ) {
                        handleQuantityChange(item.producto_id, newQuantity);
                      }
                    }}
                    className="w-20 text-center border rounded"
                  />
                </td>
                <td className="py-2 px-4 text-center ">
                  $
                  {(item.precio_venta * (item.quantity || 0)).toLocaleString(
                    "es-CO"
                  )}
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleRemove(item.producto_id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                colSpan={3}
                className="py-3 px-4 text-right font-semibold text-gray-900"
              >
                Subtotal:
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-900">
                ${calculateTotalPrice().toLocaleString("es-CO")}
              </td>
              <td></td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="py-3 px-4 text-right font-semibold text-gray-900"
              >
                IVA (19%):
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-900">
                ${(calculateTotalPrice() * 0.19).toLocaleString("es-CO")}
              </td>
              <td></td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="py-3 px-4 text-right font-semibold text-gray-900"
              >
                Total:
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-900">
                ${(calculateTotalPrice() * 1.19).toLocaleString("es-CO")}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => clearCart()}
          className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded font-semibold"
        >
          Limpiar
        </button>

        <NavLink
          className="bg-blue-700 hover:bg-blue-500 text-white py-2 px-4 rounded font-semibold"
          to="/dashboard/products/shop"
        >
          Seguir Comprando
        </NavLink>
        <button
          onClick={openModal}
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default ShoppingCartPage;

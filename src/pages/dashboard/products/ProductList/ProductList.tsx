/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
import Modal from "../../../../components/Modal";
import Create from "../create";

export const ProductList = () => {
  const [products, setProducts] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any>([]);

  const handleUpdateStatus = async (producto_id: number, estado: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}/api/productos/${producto_id}/estado`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setError(
        "Error al actualizar el estado:" + errorData.message ||
          `HTTP error! status: ${response.status}`
      );
      return false;
    }

    const data = await response.json();
    console.log("Estado actualizado:", data.message);
    // Actualizar el estado local sin recargar
    setProducts((prevProducts: any[]) =>
      prevProducts.map((product) =>
        product.producto_id === producto_id ? { ...product, estado } : product
      )
    );
  };

  const openModal = (productId: number) => {
    setOpenModalId(productId);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Productos no encontrados");

      const data = await response.json();

      setProducts(data);
    };
    getProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    const results = products.filter((product: any) =>
      String(product.codigo)
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(results);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const results = products.filter((product: any) =>
      String(product.codigo).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  };

  const productsToRender = searchTerm ? filteredProducts : products;
  return (
    <section className="bg-gray-100 min-h-screen py-8 overflow-x-auto">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de productos
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-4 flex">
          <input
            type="text"
            placeholder="Buscar por código..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            Buscar
          </button>
        </form>

        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead className="bg-gray-50">
            <tr>
              {/**
              *  <th className="py-2 px-6 text-left font-semibold text-gray-700">
                Id
              </th>
              */}
              <th className="py-2 px-6 text-left font-semibold text-gray-700">
                Codigo
              </th>
              <th className="py-2 px-6 text-left font-semibold text-gray-700 hidden">
                Sku
              </th>
              <th className="py-2 px-6 text-left font-semibold text-gray-700">
                Nombre
              </th>
              <th className="py-2 px-6 text-left font-semibold text-gray-700">
                Stock
              </th>
              <th className="py-2 px-6 text-left font-semibold text-gray-700">
                Estado
              </th>
              <th className="py-2 px-6 text-right font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {productsToRender.map((product: any) => {
              const isThisModalOpen = openModalId === product.producto_id;
              return (
                <tr
                  key={product.producto_id}
                  className="border-b border-gray-200"
                >
                  <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                    <Create productData={product} />
                  </Modal>
                  {/** <td className="py-2 px-6 text-left whitespace-nowrap text-gray-700">
                    {product.producto_id}
                  </td> */}
                  <td className="py-2 px-6 text-left whitespace-nowrap text-gray-700">
                    {product.codigo}
                  </td>
                  <td className="py-2 px-6 text-left whitespace-nowrap text-gray-700 hidden">
                    {product.sku}
                  </td>
                  <td className="py-2 px-6 text-left">
                    <div className="flex items-center text-gray-700">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.nombre_producto}
                          className="w-8 h-8 object-cover rounded-full mr-2"
                        />
                      )}
                      <span>{product.nombre_producto}</span>
                    </div>
                  </td>
                  <td className="py-2 px-6 text-left whitespace-nowrap text-gray-900">
                    {product.stock}
                  </td>
                  <td className="py-2 px-6 text-left whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        product.estado === "disponible"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {product.estado}
                    </span>
                  </td>
                  <td className="py-2 px-6 text-right whitespace-nowrap text-gray-900">
                    <div className="flex items-center justify-end">
                      <div
                        onClick={() => openModal(product.producto_id)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          width="20"
                          height="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"></path>
                          <path d="M16 5l3 3"></path>
                          <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"></path>
                        </svg>
                      </div>
                      <button
                        onClick={() => {
                          handleUpdateStatus(
                            product.producto_id,
                            product.estado === "disponible"
                              ? "no disponible"
                              : "disponible"
                          );
                        }}
                        className={`py-2 px-3 rounded-md text-xs flex items-center justify-end ${
                          product.estado === "disponible"
                            ? "bg-red-500 hover:bg-red-700 text-white"
                            : "bg-green-500 hover:bg-green-700 text-white"
                        }`}
                      >
                        {product.estado === "disponible" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                            <path d="M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611a5.012 5.012 0 0 1 -.537 .466a3.5 3.5 0 0 0 -1 3a2 2 0 1 1 -4 0a3.5 3.5 0 0 0 -1 -3a5 5 0 0 1 -.528 -7.544"></path>
                            <path d="M9.7 17h4.6"></path>
                            <path d="M3 3l18 18"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="20"
                            height="20"
                            className="text-red-500 hover:text-red-700"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                            <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path>
                            <path d="M9.7 17l4.6 0"></path>
                          </svg>
                        )}
                        {product.estado === "disponible"
                          ? "no disponible"
                          : "disponible"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

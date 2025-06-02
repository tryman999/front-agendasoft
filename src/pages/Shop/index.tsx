/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { ProductDetails } from "../../components/productDetails";
import { useCartStore } from "../../utils/zustand/store/useCartStore";
import { NavLink } from "react-router";
import ShoppingCartIconWithBadge from "../../components/ShoppingCartIcon";

export const Shop = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  const [products, setProducts] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeProduct = useCartStore((state) => state.removeProduct); // Asumimos que tienes una función para remover

  const openModal = (userId: number) => {
    setOpenModalId(userId); // Establecer el ID del usuario cuyo modal debe abrirse
  };

  const closeModal = () => {
    setOpenModalId(null); // Cerrar cualquier modal abierto
  };

  const addProduct = useCartStore((state) => state.addProduct);
  const [add, setAdd] = useState("");
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: number) => {
    removeProduct(productId);
  };
  const handleAddProduct = (product: any) => {
    addProduct({ ...product, quantity: 1 });
    setAdd("Producto fue agregado");
    setTimeout(() => {
      setAdd("");
    }, 1000);
  };

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
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  const productsToRender = searchTerm ? filteredProducts : products;
  const selectProduct = (producto_id: any) => {
    const thereIsProduct = cartItems.filter(
      (item) => item.producto_id === producto_id
    );
    return thereIsProduct;
  };
  return (
    <section className="bg-gray-100 min-h-screen py-8 overflow-scroll">
      <div className="container mx-auto px-4">
        <p className="text-green-500 hover:text-green-700 mr-2 p-2 relative">
          {add || " "}
        </p>
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
        <NavLink
          to="/shoppingCart"
          className=" flex justify-between my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          finalizar compra <ShoppingCartIconWithBadge />
        </NavLink>
        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <ul className="space-y-4">
          {productsToRender?.map((user: any) => {
            const isThisModalOpen = openModalId === user.producto_id;
            const thereIsProduct = selectProduct(user.producto_id);
            return (
              <li
                key={user.producto_id}
                className="bg-white rounded-md shadow-md overflow-hidden flex items-center"
              >
                <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                  <ProductDetails product={user} />
                </Modal>
                <img
                  src={user.image_url}
                  alt={user.nombre_producto}
                  className="w-32 h-32 object-cover mr-4"
                />
                <div className="p-4 flex-grow">
                  <h5 className="text-lg font-semibold text-gray-700 mb-1">
                    {user.nombre_producto}
                  </h5>
                  <p className="text-sm text-gray-500 mb-1">
                    Codigo: {user.codigo}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <p className="mr-2">Stock: {user.stock}</p>
                    <p>
                      Estado:{" "}
                      <span
                        className={
                          user.estado === "disponible"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {user.estado}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-center gap-2">
                  {thereIsProduct[0] ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={user.stock}
                        value={thereIsProduct[0]?.quantity || 1}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (
                            !isNaN(newQuantity) &&
                            newQuantity >= 1 &&
                            newQuantity <= user.stock
                          ) {
                            handleQuantityChange(user.producto_id, newQuantity);
                          }
                        }}
                        className="w-20 text-center border rounded bg-gray-800 text-white"
                      />
                      <button
                        onClick={() => handleRemove(user.producto_id)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-1 rounded text-xs"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="24"
                          height="24"
                          strokeWidth="2"
                        >
                          <path d="M4 7l16 0"></path>
                          <path d="M10 11l0 6"></path>
                          <path d="M14 11l0 6"></path>
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        handleAddProduct(user);
                      }}
                      className="cursor-pointer text-green-500 hover:text-green-700 mr-4"
                    >
                      agregar
                    </div>
                  )}

                  <div
                    onClick={() => openModal(user.producto_id)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    ver detalle
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

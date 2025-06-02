/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "../Modal";
import { ProductDetails } from "../productDetails";
import "./styles.css";
export const ProductCard = ({ product }: { product: any }) => {
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto

  const isThisModalOpen = openModalId === product.producto_id;

  const openModal = (userId: number) => {
    setOpenModalId(userId); // Establecer el ID del usuario cuyo modal debe abrirse
  };

  const closeModal = () => {
    setOpenModalId(null); // Cerrar cualquier modal abierto
  };

  return (
    <div className="producto-card">
      <Modal isOpen={isThisModalOpen} onClose={closeModal}>
        <ProductDetails product={product} />
      </Modal>
      <img
        src={product.image_url}
        width="200px"
        height="200px"
        alt="Nombre del Producto"
      />
      <div className="producto-info">
        <h3>{product.nombre_producto}</h3>
        <p className="descripcion">{product.descripcion}</p>
        <p className="precio">
          $ {parseFloat(product.precio_venta).toLocaleString("es-CO")}{" "}
        </p>
        <button onClick={() => openModal(product.producto_id)}>
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

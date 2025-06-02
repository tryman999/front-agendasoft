import React from "react";
import { useCartStore } from "../../utils/zustand/store/useCartStore";

const ShoppingCartIconWithBadge: React.FC = () => {
  const productCount = useCartStore((state) => state.cartItems.length);

  return (
    <div className="relative inline-block">
      {productCount > 0 && (
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
          <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M17 17h-11v-14h-2"></path>
          <path d="M6 5l14 1l-1 7h-13"></path>
        </svg>
      )}
      {productCount > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs p-1 font-bold">
          {productCount}
        </span>
      )}
      {productCount === 0 && (
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
          className="text-gray-400" // Opcional: Estilo para carrito vacío
        >
          <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
          <path d="M17 17h-11v-14h-2"></path>
          <path d="M6 5l14 1l-1 7h-13"></path>
        </svg>
      )}
    </div>
  );
};

export default ShoppingCartIconWithBadge;

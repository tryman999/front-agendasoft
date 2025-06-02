/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface CartState {
  cartItems: any[];
  addProduct: (product: any) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, _get) => ({
      cartItems: [],
      addProduct: (incomingProduct) => {
        set((state) => {
          const existingProductIndex = state.cartItems.findIndex(
            (item) => item.producto_id === incomingProduct.producto_id
          );

          if (existingProductIndex !== -1) {
            const updatedCartItems = state.cartItems.map((item, index) => {
              if (index === existingProductIndex) {
                const newQuantity = (item.quantity || 0) + 1;
                return {
                  ...item,
                  quantity: Math.min(newQuantity, incomingProduct.stock),
                };
              }
              return item;
            });
            return { cartItems: updatedCartItems };
          } else {
            return {
              cartItems: [
                ...state.cartItems,
                { ...incomingProduct, quantity: 1 },
              ],
            };
          }
        });
      },
      removeProduct: (productId: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.producto_id !== productId
          ),
        }));
      },
      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.producto_id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(quantity, item.stock)),
                }
              : item
          ),
        }));
      },
      clearCart: () => {
        // Implementación de la función clearCart
        set({ cartItems: [] });
      },
    }),
    {
      name: "cart-storage", // Nombre único para identificar el almacenamiento persistente
      storage: createJSONStorage(() => localStorage), // Usa localStorage por defecto
    }
  )
);

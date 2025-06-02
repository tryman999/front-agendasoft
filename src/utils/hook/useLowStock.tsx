/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

interface LowStockProduct {
  producto_id: number;
  nombre_producto: string;
  stock: number;
  stock_minimo: number;
  // Puedes incluir más propiedades si tu backend las devuelve
}

interface UseLowStockProductsResult {
  lowStockProducts: LowStockProduct[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void; // Función para recargar los datos manualmente
}

const useLowStockProducts = (): UseLowStockProductsResult => {
  const [lowStockProducts, setLowStockProducts] = useState<
    LowStockProduct[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLowStockProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productosConStockMinimo`
      ); // Ajusta la URL de tu API
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Error al obtener productos con bajo stock: ${response.status} - ${errorMessage}`
        );
      }
      const data = await response.json();
      console.log(data);
      setLowStockProducts(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
  }, []); // Se ejecuta una vez al montar el componente

  // Función para permitir la recarga manual de los datos
  const refetch = () => {
    fetchLowStockProducts();
  };

  return { lowStockProducts, loading, error, refetch };
};

export default useLowStockProducts;

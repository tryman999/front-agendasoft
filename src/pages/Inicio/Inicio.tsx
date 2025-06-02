/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import { ProductCard } from "../../components/productCard";

const Inicio: FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);

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
      if (!response.ok) setError("Porduct no encontrados");

      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-white-800 mb-6">
          Bienvenido
        </h1>
        <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((item: any) => (
            <ProductCard key={item.producto_id} product={item} />
          ))}
          {errorState && (
            <div className="col-span-full">
              <p className="text-red-500 py-4">{errorState}</p>
            </div>
          )}
          {products.length === 0 && !errorState && (
            <div className="col-span-full">
              <p className="text-gray-600 py-4">
                No hay productos disponibles.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inicio;

import React from "react";
import useLowStockProducts from "../../utils/hook/useLowStock";

const LowStockProductsList: React.FC = () => {
  const { lowStockProducts, loading, error, refetch } = useLowStockProducts();

  if (loading) {
    return <p>Cargando productos con bajo stock...</p>;
  }

  if (error) {
    return <p>Error al cargar los productos con bajo stock: {error}</p>;
  }

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return <p>No hay productos cercanos al stock mínimo.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Productos Cercanos al Stock Mínimo
      </h2>
      <ul className="list-none space-y-2">
        {lowStockProducts.map((product) => (
          <li
            key={product.producto_id}
            className="bg-gray-50 rounded-md p-3 flex items-center justify-between"
          >
            <span className="font-medium text-gray-700">
              {product.nombre_producto}
            </span>
            <div className="text-sm text-gray-600">
              Stock: <span className="font-semibold">{product.stock}</span>{" "}
              (Mínimo:{" "}
              <span className="font-semibold">{product.stock_minimo}</span>)
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button
          onClick={refetch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Recargar lista
        </button>
      </div>
    </div>
  );
};

export default LowStockProductsList;

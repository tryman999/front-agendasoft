/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";

interface Cambio {
  cambio_id: number;
  venta_original_id: number;
  fecha_venta_original: string; // Ajusta el tipo según el formato de tu fecha
  total_venta_original: number;
  producto_original_id: number;
  nombre_producto_original: string;
  precio_producto_original: number;
  cantidad_original: number;
  producto_nuevo_id: number;
  nombre_producto_nuevo: string;
  precio_producto_nuevo: number;
  cantidad_nueva: number;
  fecha_solicitud: string; // Ajusta el tipo según el formato de tu fecha
  fecha_cambio: string | null;
  motivo_cambio: string | null;
  estado_cambio: string;
  observaciones: string | null;
}

const ListaDeCambios: React.FC = () => {
  const [cambios, setCambios] = useState<Cambio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCambios = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/cambios`
        ); // Reemplaza con la URL de tu API para obtener los cambios
        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.message ||
              `Error al obtener los cambios: ${response.status}`
          );
          return;
        }
        const data: any[] = await response.json();
        setCambios(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido al obtener los cambios");
      } finally {
        setLoading(false);
      }
    };

    fetchCambios();
  }, []);

  if (loading) {
    return <div>Cargando la lista de cambios...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de Cambios Realizados
        </h1>
        {cambios.length > 0 ? (
          <ul className="space-y-4">
            {cambios.map((cambio: any) => (
              <li
                key={cambio.cambio_id}
                className="bg-white shadow rounded-md p-4"
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  Cliente: {cambio.email}
                </h2>
                {cambio.cambios.map((items: any) => {
                  return (
                    <li
                      key={items.venta_original_id}
                      className="bg-white shadow rounded-md p-4 mb-4"
                    >
                      <p className="text-gray-500 mb-1">
                        Venta Original ID: {items.venta_original_id} <br />
                        Fecha: {items.fecha_venta}
                        <br />
                        Total:$
                        {parseFloat(items.total_venta).toLocaleString("es-CO")}
                        <br />
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-md font-semibold text-gray-600">
                            Producto Original
                          </h3>
                          <p className="text-gray-500">
                            ID: {items.producto_original_id}
                          </p>
                          <p className="text-gray-500">
                            Nombre: {items.nombre_producto_original}
                          </p>
                          <p className="text-gray-500">
                            Precio: ${" "}
                            {parseFloat(
                              items.precio_venta_original
                            ).toLocaleString("es-CO")}
                          </p>
                          <p className="text-gray-500">
                            Cantidad Original: {items.cantidad_original}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-md font-semibold text-gray-600">
                            Producto Nuevo
                          </h3>
                          <p className="text-gray-500">
                            ID: {items.producto_nuevo_id}
                          </p>
                          <p className="text-gray-500">
                            Nombre: {items.nombre_producto_nuevo}
                          </p>
                          <p className="text-gray-500">
                            Precio: ${" "}
                            {parseFloat(
                              items.precio_venta_nuevo
                            ).toLocaleString("es-CO")}
                          </p>
                          <p className="text-gray-500">
                            Cantidad Nueva: {items.cantidad_nueva}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 mb-1">
                        Fecha Solicitud:{" "}
                        {new Date(items.fecha_solicitud).toLocaleString()}
                      </p>
                      {items.fecha_cambio && (
                        <p className="text-gray-500 mb-1">
                          Fecha Cambio: {items.fecha_cambio}
                        </p>
                      )}
                      {items.motivo_cambio && (
                        <p className="text-gray-500 mb-1">
                          Motivo del Cambio: {items.motivo_cambio}
                        </p>
                      )}
                      <p className="text-gray-500 mb-1">
                        Estado del Cambio: {items.estado_cambio}
                      </p>
                      {items.observaciones && (
                        <p className="text-gray-500">
                          Observaciones: {items.observaciones}
                        </p>
                      )}
                    </li>
                  );
                })}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No se encontraron cambios realizados.</p>
        )}
      </div>
    </div>
  );
};

export default ListaDeCambios;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import { FormularioEnvio } from "./formulario_envio";

export const Ventas = () => {
  const [open, setOpen] = useState(false);
  const [ventasAgrupadas, setVentasAgrupadas] = useState<any[]>([]);
  const [newQuantities, setNewQuantities] = useState<
    Record<number, number | null>
  >({});
  const [selectedVentaId, setSelectedVentaId] = useState<number | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [productsToChange, setProductsToChange] = useState<any[]>([]);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedChangeProducts, setSelectedChangeProducts] = useState<
    Record<number, number | null>
  >({});
  const [changeReasons, setChangeReasons] = useState<Record<number, string>>(
    {}
  );
  const [changeObservations, setChangeObservations] = useState<
    Record<number, string>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detalleVentaEnviado, setdetalleVentaEnviado] = useState();
  const handleVentaClick = (ventaId: number) => {
    setSelectedVentaId(ventaId === selectedVentaId ? null : ventaId);
    setIsChanging(false); // Reset cambio state when a new venta is selected/unselected
    setProductsToChange([]);
    setSelectedChangeProducts({});
    setNewQuantities({});
    setChangeReasons({}); // Reset change reasons
    setChangeObservations({});
  };

  const handleHacerCambioClick = (detalles: any[]) => {
    setIsChanging(true);
    setProductsToChange(detalles);
    // Fetch available products for change
    fetchAvailableProducts();
    const initialQuantities: Record<number, number | null> = {};
    const initialReasons: Record<number, string> = {};
    const initialObservations: Record<number, string> = {};
    detalles.forEach((detalle) => {
      initialQuantities[detalle.detalle_id] = detalle.cantidad;
      initialReasons[detalle.detalle_id] = ""; // Inicializar con cadena vacía
      initialObservations[detalle.detalle_id] = ""; // Inicializar con cadena vacía
    });
    setNewQuantities(initialQuantities);
    setChangeReasons(initialReasons);
    setChangeObservations(initialObservations);
  };
  const handleReasonChange = (detalleId: number, value: string) => {
    setChangeReasons((prev) => ({
      ...prev,
      [detalleId]: value,
    }));
  };

  const handleObservationsChange = (detalleId: number, value: string) => {
    setChangeObservations((prev) => ({
      ...prev,
      [detalleId]: value,
    }));
  };

  const handleNewQuantityChange = (detalleId: number, value: string) => {
    setNewQuantities((prev) => ({
      ...prev,
      [detalleId]: Number(value),
    }));
  };

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`, // Assuming you have an endpoint to get all products
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al obtener productos: ${response.status}`
        );
        return;
      }

      const dataProductos = await response.json();
      setAvailableProducts(dataProductos);
    } catch (err: any) {
      setError(err.message || "Error desconocido al obtener productos");
    }
  };

  const handleProductChangeSelect = (
    detalleId: number,
    newProductId: string
  ) => {
    setSelectedChangeProducts((prev) => ({
      ...prev,
      [detalleId]: parseInt(newProductId),
    }));
  };

  const handleSaveChanges = async (ventaId: number, detalles: any[]) => {
    const changes = detalles.map((detalle) => ({
      venta_original_id: detalle.venta_id,
      producto_original_id: detalle.producto_id,
      cantidad_original: detalle.cantidad,
      detalle_id: detalle.detalle_id,
      cantidad_nueva: newQuantities[detalle.detalle_id],
      producto_nuevo_id:
        selectedChangeProducts[detalle.detalle_id] || detalle.producto_id,
      fecha_cambio: new Date(),
      motivo_cambio: changeReasons[detalle.detalle_id], // Incluir el motivo
      observaciones: changeObservations[detalle.detalle_id], // Incluir las observaciones
    }));

    console.log(detalles, ventaId);

    // Filter out changes where the new product is the same or the price is lower

    const validChanges = changes.filter((change) => {
      return change.producto_original_id !== change.producto_nuevo_id;
    });

    if (validChanges.length === 0) {
      setError("No se seleccionaron cambios válidos (mismo producto).");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/cambios`, // Assuming you have an API endpoint for product changes
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cambios: validChanges }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al realizar el cambio: ${response.status}`
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      setIsChanging(false);
      setSelectedChangeProducts({});
      // Optionally, refresh the ventas list
      // getVentas();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido al realizar el cambio");
    }
  };

  const handleEnvio = async (detalles: any) => {
    setdetalleVentaEnviado(detalles);
    setOpen(!open);
  };

  useEffect(() => {
    const getVentas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/ventas`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.message || `Error al obtener ventas: ${response.status}`
          );
          setLoading(false);
          return;
        }

        setLoading(false);
        const dataVenta = await response.json();
        setVentasAgrupadas(dataVenta);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al obtener ventas");
      }
    };
    getVentas();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <Modal isOpen={open} onClose={() => setOpen(!open)}>
        <FormularioEnvio
          venta={detalleVentaEnviado}
          onClose={() => setOpen(!open)}
        />
      </Modal>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de Ventas
        </h1>
        {loading && <p>cargando...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul className="space-y-4">
          {ventasAgrupadas.map((venta) => {
            const date = new Date(venta.detalles[0].fecha_venta);

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() es 0-indexado, por eso +1
            const day = date.getDate().toString().padStart(2, "0");

            // Concatenamos para formar el string deseado
            const formattedDate = `${year}${month}${day}`;
            return (
              <li
                key={venta.venta_id}
                className="bg-white shadow rounded-md overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => handleVentaClick(venta.venta_id)}
                >
                  <h2 className="text-sm font-semibold text-gray-700">
                    Venta ID: {`${formattedDate}_${venta.venta_id}`} -{" "}
                    {venta.detalles[0].email}
                  </h2>
                </div>
                {selectedVentaId === venta.venta_id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Detalles de la Venta
                    </h3>
                    {venta.detalles.length > 0 ? (
                      <>
                        <ul className="space-y-2">
                          {venta.detalles.map((detalle: any, index: any) => (
                            <li
                              key={index}
                              className="text-gray-500 flex flex-col mb-2 border-b border-gray-300 pb-2"
                            >
                              <span className="font-semibold">
                                Detalle ID: {detalle.detalle_id}
                              </span>
                              <span className="font-semibold">
                                Producto Original: {detalle.nombre_producto}{" "}
                                (ID: {detalle.producto_id}) - $
                                {parseInt(
                                  detalle.precio_unitario
                                ).toLocaleString("es-CO")}
                              </span>
                              {isChanging &&
                                productsToChange.some(
                                  (p) => p.detalle_id === detalle.detalle_id
                                ) && (
                                  <div className="mt-2">
                                    <label
                                      htmlFor={`change-product-${detalle.detalle_id}`}
                                      className="block text-gray-700 text-sm font-bold mb-1"
                                    >
                                      Cambiar por:
                                    </label>
                                    <select
                                      id={`change-product-${detalle.detalle_id}`}
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                      value={
                                        selectedChangeProducts[
                                          detalle.detalle_id
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleProductChangeSelect(
                                          detalle.detalle_id,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Seleccionar producto
                                      </option>
                                      {availableProducts
                                        .filter(
                                          (product) =>
                                            Number(product.producto_id) !==
                                            Number(detalle.producto_id)
                                        )
                                        .map((product: any) => (
                                          <option
                                            key={product.producto_id}
                                            value={product.producto_id}
                                          >
                                            {product.nombre_producto} - $
                                            {parseInt(
                                              product.precio_venta
                                            ).toLocaleString("es-CO")}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                )}
                              <span className="font-semibold">
                                Cantidad: {detalle.cantidad}
                                {isChanging &&
                                  productsToChange.some(
                                    (p) => p.detalle_id === detalle.detalle_id
                                  ) && (
                                    <input
                                      name="newQuantity"
                                      value={
                                        newQuantities[detalle.detalle_id] || ""
                                      }
                                      onChange={(e) =>
                                        handleNewQuantityChange(
                                          detalle.detalle_id,
                                          e.target.value
                                        )
                                      }
                                      type="number"
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  )}
                              </span>
                              {isChanging &&
                                productsToChange.some(
                                  (p) => p.detalle_id === detalle.detalle_id
                                ) && (
                                  <>
                                    <div className="mt-2">
                                      <label
                                        htmlFor={`change-reason-${detalle.detalle_id}`}
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                      >
                                        Motivo del Cambio:
                                      </label>
                                      <input
                                        type="text"
                                        id={`change-reason-${detalle.detalle_id}`}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={
                                          changeReasons[detalle.detalle_id] ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          handleReasonChange(
                                            detalle.detalle_id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="mt-2">
                                      <label
                                        htmlFor={`change-observations-${detalle.detalle_id}`}
                                        className="block text-gray-700 text-sm font-bold mb-1"
                                      >
                                        Observaciones:
                                      </label>
                                      <textarea
                                        id={`change-observations-${detalle.detalle_id}`}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={
                                          changeObservations[
                                            detalle.detalle_id
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleObservationsChange(
                                            detalle.detalle_id,
                                            e.target.value
                                          )
                                        }
                                        rows={3}
                                      />
                                    </div>
                                  </>
                                )}
                              <span className="font-semibold">
                                Subtotal: $
                                {parseInt(detalle.subtotal).toLocaleString(
                                  "es-CO"
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="my-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          type="button"
                          onClick={() => handleEnvio(venta)}
                        >
                          Enviar
                        </button>
                        {!isChanging ? (
                          <button
                            className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() =>
                              handleHacerCambioClick(venta.detalles)
                            }
                          >
                            Hacer cambio
                          </button>
                        ) : (
                          <div className="flex space-x-2 my-2">
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={() =>
                                handleSaveChanges(
                                  venta.venta_id,
                                  venta.detalles
                                )
                              }
                            >
                              Guardar Cambios
                            </button>
                            <button
                              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                              type="button"
                              onClick={() => setIsChanging(false)}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">
                        No hay detalles para esta venta.
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

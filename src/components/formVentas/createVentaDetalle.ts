/* eslint-disable @typescript-eslint/no-explicit-any */
export const createVentaDetalle = async ({
  setError,
  setLoading,
  venta_id,
  products,
}: {
  setError: any;
  setLoading: any;
  venta_id: any;
  products: any;
}) => {
  const body = { venta_id, products };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}/api/ventasDetalles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setError(
        errorData.message || `Error al crear cliente: ${response.status}`
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    const dataVentaDetalle = await response.json();
    return dataVentaDetalle;
  } catch (err: any) {
    setLoading(false);
    setError(err.message || "Error desconocido al crear cliente");
  }
};

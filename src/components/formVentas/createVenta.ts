/* eslint-disable @typescript-eslint/no-explicit-any */
export const createVenta = async ({
  setError,
  setLoading,
  selectedAuxiliary,
  selectedClient,
  totalPrice,
}: {
  setError: any;
  setLoading: any;
  selectedAuxiliary: any;
  selectedClient: any;
  totalPrice: any;
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}/api/ventas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auxiliar_ventas_id: selectedAuxiliary,
          cliente_id: selectedClient,
          total_venta: totalPrice,
        }),
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
    const dataVenta = await response.json();
    const venta_id = dataVenta.venta_id;
    return venta_id;
  } catch (err: any) {
    setLoading(false);
    setError(err.message || "Error desconocido al crear cliente");
  }
};

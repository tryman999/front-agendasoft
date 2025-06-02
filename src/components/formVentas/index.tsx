/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import { createVenta } from "./createVenta";
import { createVentaDetalle } from "./createVentaDetalle";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import Register from "../../pages/Register";

export const FormVentas: FC<{
  clients: any;
  auxiliaries: any;
  totalPrice: any;
  products: any;
}> = ({ clients, auxiliaries, totalPrice, products }) => {
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<
    number | string | ""
  >(0);
  const [selectedClient, setSelectedClient] = useState<number | string | "">(
    ""
  );
  const { storage } = useSessionStorage("user", null);

  const [viewForm, setViewForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dataAux = auxiliaries.filter(
    (item: any) => item?.usuario_id === storage?.user?.usuario_id
  );
  console.log("dataAux", dataAux);
  console.log("storage?.user", storage?.user);
  const dataClient = clients.filter(
    (item: { usuario_id: string | number }) =>
      item?.usuario_id === selectedClient
  );

  const handleAuxiliaryChange = () => {
    setSelectedAuxiliary(dataAux[0]?.usuario_id || 1);
  };

  const [searchDocument, setSearchDocument] = useState("");
  const [filteredClients, setFilteredClients] = useState<any>([]);

  const handleSearchDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchText = event.target.value.toLowerCase();
    setSearchDocument(searchText);
    const results = clients.filter((client: any) =>
      client.documento.toLowerCase().includes(searchText)
    );
    setFilteredClients(results);
  };

  const handleClientSelect = (clientId: number) => {
    setSelectedClient(clientId);
    setSearchDocument("");
    setFilteredClients([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    handleAuxiliaryChange();
    const venta_id = await createVenta({
      setError,
      setLoading,
      selectedAuxiliary,
      selectedClient,
      totalPrice,
    });
    if (venta_id) {
      const ventaDetalle = await createVentaDetalle({
        setError,
        setLoading,
        venta_id,
        products,
      });
      console.log(ventaDetalle);
    }
  };
  console.log(filteredClients);
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <p className="text-gray-900">
            Subtotal: $ {parseInt(totalPrice).toLocaleString("es-CO")}
          </p>
          <p className="text-gray-900">
            IVA (19%): $ {(parseInt(totalPrice) * 0.19).toLocaleString("es-CO")}
          </p>
          <p className="text-gray-900 font-semibold">
            Precio Total (con IVA): ${" "}
            {(parseInt(totalPrice) * 1.19).toLocaleString("es-CO")}
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="auxiliary"
          >
            Responsable de la venta:
          </label>
          <p className="block text-gray-700 text-sm">{dataAux[0] || "Admin"}</p>
        </div>
        {dataClient.length > 0 && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="auxiliary"
            >
              Cliente:
            </label>
            <p className="block text-gray-700 text-sm">
              {dataClient[0]?.nombre_cliente} - {dataClient[0]?.documento}
            </p>
          </div>
        )}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="searchDocument"
          >
            Buscar Cliente por Documento:
          </label>
          <input
            type="text"
            id="searchDocument"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ingrese el documento del cliente"
            value={searchDocument}
            onChange={handleSearchDocumentChange}
          />
          {filteredClients.length > 0 ? (
            <div className="mt-2 border rounded shadow-sm bg-white">
              {filteredClients.map((client: any) => (
                <div
                  key={client.usuario_id}
                  className="px-3 text-gray-800 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClientSelect(client.usuario_id)}
                >
                  {client.documento} - {client.email}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-800">
              <div
                onClick={() => setViewForm(!viewForm)}
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                Crear este cliente
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Crear venta"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
      {viewForm && (
        <section className="w-full">
          <Register />
        </section>
      )}
    </>
  );
};

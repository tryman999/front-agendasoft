/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const FormularioEnvio = ({
  venta,
  onClose,
}: {
  venta: any;
  onClose: any;
}) => {
  console.log({ venta });
  const [observacion, setobservacion] = useState("");
  const [newDireccion, setDireccionNew] = useState("");
  const [clientsState, setClientState] = useState<any>({
    nombre_cliente: "",
    documento: "",
    direccion: "",
    telefono: "",
    email: "",
    usuario_id: venta.detalles[0].usuario_id,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getClient = async () => {
      setLoading(true);
      setError(null);

      try {
        if (venta.detalles[0].cliente_id) {
          const response = await fetch(
            `${import.meta.env.VITE_BACK_URL}/api/clientes/${
              venta.detalles[0].cliente_id
            }`,
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
              errorData.message || `Usuario no encontrado: ${response.status}`
            );
            setLoading(false);
            return;
          }
          const data = await response.json();
          setClientState({
            nombre_cliente: data.nombre_cliente || "",
            documento: data.documento || "",
            direccion: data.direccion || "",
            telefono: data.telefono || "",
            email: data.email || "",
            usuario_id: data.usuario_id,
          });
          setLoading(false);
        } else {
          setError("No se encontró la información del usuario.");
          setLoading(false);
        }
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al obtener cliente");
      }
    };

    getClient();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      venta_id: venta.venta_id,
      fecha_envio: new Date(),
      direccion_entrega: newDireccion || clientsState.direccion,
      estado: "pendiente",
      cliente_id: clientsState.usuario_id,
      observacion,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/entregas`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || `registro fallido: ${response.status}`);
        setLoading(false);
        return;
      }
      //const data = await response.json();
      onClose();
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido al obtener cliente");
    }
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center border-b-2 pb-4 border-gray-200">
        Registro de Envío
      </h2>
      {loading && <p className="text-gray-800"> cargando...</p>}
      {error && <p className="text-gray-800">Error: {error}</p>}

      <form id="shipmentForm" className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="direccion_entrega"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Dirección de Entrega: (opcional)
          </label>
          <input
            type="text"
            id="direccion_entrega"
            name="direccion_entrega"
            required={false}
            onChange={(event) => setDireccionNew(event.target.value)}
            placeholder="Ej: Calle 123 #45-67"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
          <p className="text-gray-800">
            direccion actual: {clientsState.direccion}
          </p>
        </div>

        <div>
          <label
            htmlFor="observaciones"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Observaciones:
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows={4}
            onChange={(e) => setobservacion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="usuario_responsable_id"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Documento de Usuario Responsable:
          </label>
          <input
            type="text"
            id="usuario_responsable_id"
            name="usuario_responsable_id"
            value={clientsState.documento}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
        >
          Registrar Envío
        </button>
      </form>
    </div>
  );
};

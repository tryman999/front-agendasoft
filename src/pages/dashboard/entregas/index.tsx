/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import Modal from "../../../components/Modal";

// Definimos un tipo para la entrega, útil para TypeScript

// Estados posibles para la entrega
const ESTADOS_ENTREGA = [
  "pendiente",
  "en_transito",
  "entregado",
  "fallido",
  "cancelado",
];

const EntregaList = () => {
  const [entregas, setEntregas] = useState<any>([]); // Usamos el tipo Entrega[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [observacion, setObservacion] = useState("");
  console.log("AAA", entregas);
  // Estados para la edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState<any | null>(null);
  const [newEstado, setNewEstado] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); // Para mostrar estado de actualización

  const fetchEntregas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/entregas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEntregas(data);
    } catch (e) {
      console.error("Error fetching entregas:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const fechaInicioFormateada = useCallback(() => {
    return `${selectedDate}`;
  }, [selectedDate]);

  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    fetchEntregas();
  }, []);

  // Función para abrir el modal de edición
  const openEditModal = (entrega: any) => {
    setSelectedEntrega(entrega);
    setNewEstado(entrega.estado); // El estado inicial del select es el actual
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedEntrega(null);
    setNewEstado("");
  };

  // Función para manejar la actualización del estado
  const handleUpdateEstado = async (id_entrega: any) => {
    if (!selectedEntrega) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/entregas/${id_entrega}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: newEstado,
            fecha_envio: fechaInicioFormateada(),
            observacion,
          }),
        }
      );
      window.location.reload();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      closeEditModal(); // Cerrar el modal después de la actualización exitosa
      // Opcional: Volver a cargar todos los datos para asegurar la consistencia
      // await fetchEntregas();
    } catch (e: any) {
      console.error("Error updating estado:", e);
      setError(e); // Mostrar error en la UI
      alert(`Error al actualizar el estado: ${e.message}`); // Alerta simple para el usuario
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline">
          {" "}
          {error?.message || "No se pudieron cargar los datos de entregas."}
        </span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Listado de Entregas
      </h1>

      {entregas.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative text-center">
          No hay entregas registradas.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Envío
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opciones
                </th>{" "}
                {/* Cambiado de 'Opcion' a 'Opciones' para plural */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entregas.map((entrega: any) => {
                const date = new Date(entrega.fecha_venta);

                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() es 0-indexado, por eso +1
                const day = date.getDate().toString().padStart(2, "0");

                // Concatenamos para formar el string deseado
                const formattedDate = `${year}${month}${day}`;
                return (
                  <tr key={entrega.id_entrega} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {`${formattedDate}_${entrega.venta_id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {entrega.nombre_cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {entrega.documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(entrega.fecha_envio).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {entrega.direccion_entrega}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        entrega.estado === "entregado"
                          ? "bg-green-100 text-green-800"
                          : entrega.estado === "en_transito"
                          ? "bg-blue-100 text-blue-800"
                          : entrega.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      >
                        {entrega.estado.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">
                      {entrega.observacion || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(entrega)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md transition duration-150 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                          <path d="M16 5l3 3" />
                        </svg>{" "}
                        Editar Estado
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Modal isOpen={isModalOpen} onClose={closeEditModal}>
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Editar Estado de Entrega
              </h3>
              <p className="text-gray-700 mb-4">
                ID Venta:{" "}
                <span className="font-semibold">
                  {selectedEntrega?.entrega_id}
                </span>
              </p>
              <p className="text-gray-700 mb-4">
                Cliente:{" "}
                <span className="font-semibold">
                  {selectedEntrega?.nombre_cliente}
                </span>
              </p>

              <div className="col-span-full">
                <label
                  htmlFor="horaCita"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Fecha de cita
                </label>

                <input
                  type="date"
                  id="fechaCita"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                />
              </div>

              <div>
                <label
                  htmlFor="horaCita"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  observacion
                </label>

                <textarea
                  id="observacion"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={2}
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newEstado"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Nuevo Estado:
                </label>
                <select
                  id="newEstado"
                  value={newEstado}
                  onChange={(e) => setNewEstado(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={isUpdating} // Deshabilitar mientras se actualiza
                >
                  {ESTADOS_ENTREGA.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  onClick={() =>
                    handleUpdateEstado(selectedEntrega?.entrega_id)
                  }
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Actualizando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default EntregaList;

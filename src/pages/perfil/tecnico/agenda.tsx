/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useSessionStorage } from "../../../utils/hook/useSessionStorage";
import Modal from "../../../components/Modal";
import ImageUploaderFetch from "./imagenUpload";
import { DateTimer } from "../../dashboard/citas/dateTimer";

const ListarCitasPerfil = () => {
  const { storage } = useSessionStorage("user", null);
  const [open, setModal] = useState(false);
  const [open2, setModal2] = useState(false);

  const [citas, setCitas] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [garantia, setGarantia] = useState<any>();
  const [estado, setestado] = useState<any>();
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState<any>();

  const [selectedDate, setSelectedDate] = useState<any>();
  const [showTime, setShowTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>();
  const [direccionActual, setDireccionActual] = useState();
  const [selectedClient, setSelectedClient] = useState<any>();

  const fechaInicioFormateada = useCallback(() => {
    return selectedDate ? `${selectedDate} ${selectedTime}:00` : undefined;
  }, [selectedDate, selectedTime]);
  const fecha = fechaInicioFormateada();
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/getServicioTecnico/${
            storage?.user?.usuario_id
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCitas(data);
      } catch (e: any) {
        setError("Error al cargar las citas: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() devuelve de 0 a 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando citas...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  function generarCodigoDe4Digitos() {
    const numero = Math.floor(Math.random() * 10000);

    return String(numero).padStart(4, "0");
  }

  const handleShowSelectTimer = () => {
    setShowTime(!showTime);
  };

  const handleSubmitEdit = async (e: any) => {
    e.preventDefault();
    const body = {
      garantia: garantia,
      fecha_inicio: fecha,
      direccion_servicio: direccion || direccionActual,
      cliente_id: selectedClient,
      estado,
      descripcion,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/citas/update`,
        {
          method: "PUT", // Utilizamos PUT para actualizar un recurso existente
          headers: {
            "Content-Type": "application/json", // Indicamos que el cuerpo de la solicitud es JSON
          },
          body: JSON.stringify(body), // Convertimos el objeto JavaScript 'body' a una cadena JSON
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Algo salió mal al actualizar el servicio."
        );
      }

      const data = await response.json();
      console.log("Servicio actualizado con éxito:", data);
      alert("¡Servicio actualizado correctamente!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error al enviar la solicitud:", error);
      alert(`Error al actualizar el servicio: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-8 text-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Citas Agendadas
      </h1>
      {citas.length === 0 ? (
        <p className="text-gray-600">No hay citas agendadas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fecha Inicio
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Garantía
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Evidencia
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  .
                </th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita: any, index: any) => (
                <>
                  <tr key={`${cita.servicio_id}_${index}`}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {`${generarCodigoDe4Digitos()}${index}_${
                        cita.servicio_id
                      }`}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {formatDate(cita.fecha_inicio)}
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita?.cliente_documento} - {cita.cliente_email}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.tecnico_documento} - {cita.tecnico_email}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.diagnostico || "-"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.estado || "-"}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.direccion_servicio}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.garantia}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.descripcion_problema}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {cita.imagen_evidencia ? (
                        <img
                          src={cita?.imagen_evidencia}
                          className="w-[4rem] h-[4rem]"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="flex flex-col  gap-2 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className="underline cursor-pointer flex items-center"
                        onClick={() => {
                          setModal(!open);
                          setSelectedClient(cita.servicio_id);
                          setDireccionActual(cita.direccion_servicio);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-edit"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                          <path d="M16 5l3 3" />
                        </svg>
                        editar
                      </span>

                      <span
                        className="underline cursor-pointer flex items-center "
                        onClick={() => {
                          setModal2(!open2);
                          setSelectedClient(cita.servicio_id);
                          setDireccionActual(cita.direccion_servicio);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="icon icon-tabler icons-tabler-outline icon-tabler-upload"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                          <path d="M7 9l5 -5l5 5" />
                          <path d="M12 4l0 12" />
                        </svg>
                        subir evidencia
                      </span>
                    </td>
                  </tr>
                  <Modal isOpen={open} onClose={() => setModal(!open)}>
                    <h1 className="text-black">Reagendar Cita</h1>
                    <form
                      className="h-full w-full p-[1rem]"
                      onSubmit={handleSubmitEdit}
                    >
                      <div className="col-span-full">
                        <label
                          htmlFor="horaCita"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Fecha de cita (opcional)
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
                      <div className="col-span-full">
                        <label
                          htmlFor="horaCita"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Hora de cita (opcional)
                        </label>
                        <div className="flex flex-col">
                          <button
                            className="flex w-full gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            type="button"
                            onClick={handleShowSelectTimer}
                          >
                            Seleccionar{" "}
                            {selectedTime ? (
                              <span className=" text-gray-700">
                                Hora: {selectedTime}
                              </span>
                            ) : (
                              <span className=" text-gray-700">Hora: ...</span>
                            )}
                          </button>
                          {showTime && (
                            <DateTimer
                              citas={citas}
                              fechaInicioFormateada={fecha}
                              handleShowSelectTimer={handleShowSelectTimer}
                              selectedTime={selectedTime}
                              setSelectedTime={setSelectedTime}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-span-full">
                        <label
                          htmlFor="descripcion"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Direccion de la cita. (opcional)
                        </label>
                        <textarea
                          id="direccion"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={1}
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        ></textarea>
                        <p className="text-black">
                          Direccion actual: {cita.direccion_servicio}
                        </p>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="descripcion"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Tiene Garantia (opcional)
                        </label>

                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          onChange={(e) => setGarantia(e.target.value)}
                        >
                          <option>Seleccione una opcion</option>
                          <option value="No"> No</option>
                          <option value="Si"> Si</option>
                        </select>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="descripcion"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Estado (opcional)
                        </label>

                        <select
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          onChange={(e) => setestado(e.target.value)}
                        >
                          <option>Seleccione una opcion</option>
                          <option value="pendiente"> pendiente</option>
                          <option value="en garantia"> en garantia</option>
                          <option value="terminado"> terminado</option>
                        </select>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="descripcion"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Descripcion. (opcional)
                        </label>
                        <textarea
                          id="descripcion"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          rows={2}
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                        ></textarea>
                      </div>

                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                      >
                        Enviar
                      </button>
                    </form>
                  </Modal>

                  <Modal
                    key={121}
                    isOpen={open2}
                    onClose={() => {
                      setModal2(!open2);
                    }}
                  >
                    <>
                      <ImageUploaderFetch id={cita.servicio_id} />
                    </>
                  </Modal>
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarCitasPerfil;

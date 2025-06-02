/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import Modal from "../../../components/Modal";
import { DateTimer } from "./dateTimer";

const ListarCitas = () => {
  const [citas, setCitas] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setModal] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedClient, setSelectedClient] = useState();
  const [garantia, setGarantia] = useState<any>();
  const [estado, setestado] = useState<any>();
  const [descripcion, setDescripcion] = useState<any>();
  const [direccionActual, setDireccionActual] = useState();
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
          `${import.meta.env.VITE_BACK_URL}/api/getServicioTecnico`
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

  function generarCodigoDe4Digitos() {
    const numero = Math.floor(Math.random() * 10000);

    return String(numero).padStart(4, "0");
  }

  useEffect(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
    const day = String(today.getDate()).padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleSubmit = async (e: any) => {
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() devuelve de 0 a 11
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleShowSelectTimer = () => {
    setShowTime(!showTime);
  };

  const handleDeleteCita = (id: any) => {
    const estaSeguro = confirm(
      `¿Estás seguro de que deseas eliminar el servicio técnico ? Esta acción no se puede deshacer.`
    );

    if (!estaSeguro) {
      console.log("Eliminación cancelada por el usuario.");
      return; // Sale de la función si el usuario cancela
    }

    fetch(`${import.meta.env.VITE_BACK_URL}/api/citas/delete/${id}`, {
      method: "DELETE", // Método HTTP para eliminar
      headers: {
        "Content-Type": "application/json", // Aunque no envíes un body, es buena práctica incluirlo
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Error al eliminar el servicio.");
          });
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return {};
        }
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        alert("¡Servicio eliminado correctamente!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Hubo un error al eliminar el servicio:", error);
        alert("Error al eliminar el servicio: " + error.message);
      });
  };

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
                  Fecha Fin
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
              {citas.map((cita: any, index: any) => {
                console.log(cita);
                return (
                  <tr key={cita.servicio_id}>
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
                      {cita.garantia || "-"}
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

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-col gap-2">
                      <button
                        className="flex items-center"
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
                        editar
                      </button>

                      <button
                        className="flex items-center"
                        onClick={() => {
                          handleDeleteCita(cita.servicio_id);
                        }}
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
                          className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M4 7l16 0" />
                          <path d="M10 11l0 6" />
                          <path d="M14 11l0 6" />
                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>{" "}
                        eliminar
                      </button>
                    </td>
                    <Modal isOpen={open} onClose={() => setModal(!open)}>
                      <h1 className="text-black">Reagendar Cita</h1>
                      <form
                        className="h-full w-full p-[1rem]"
                        onSubmit={handleSubmit}
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
                                <span className=" text-gray-700">
                                  Hora: ...
                                </span>
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
                          <p className="text-black mb-2">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListarCitas;

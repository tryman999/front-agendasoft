/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSessionStorage } from "../../../utils/hook/useSessionStorage";
import { FormsClient } from "../../dashboard/usersList/form";
import Modal from "../../../components/Modal";
import { NavLink, Outlet } from "react-router";

export const Tecnico = () => {
  const { storage } = useSessionStorage("user", null);
  const [viewModal, setViewModal] = useState(false);
  const [clientsState, setClientState] = useState({
    nombre_cliente: "",
    documento: "",
    direccion: "",
    telefono: "",
    email: "",
    usuario_id: storage?.user?.usuario_id, // Use optional chaining
  });
  const [errorData, setError] = useState<string | null>(null);
  const [loadingData, setLoading] = useState(true); // Initialize loading to true

  useEffect(() => {
    const getClient = async () => {
      setLoading(true);
      setError(null);

      try {
        if (storage?.user?.usuario_id) {
          const response = await fetch(
            `${import.meta.env.VITE_BACK_URL}/api/clientes/${
              storage.user.usuario_id
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
  }, [storage?.user?.usuario_id]); // Use optional chaining in dependency array

  if (loadingData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Cargando perfil...</div>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-500 text-xl">{errorData}</div>
        <div className="text-red-500 text-xl">Completa tu perfil</div>
        <FormsClient user={clientsState} />
      </div>
    );
  }

  const handleEditClick = () => {
    setViewModal(!viewModal);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <Modal isOpen={viewModal} onClose={handleEditClick}>
        <FormsClient user={clientsState} />
      </Modal>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Perfil de Tecnico
        </h1>
        <div className="flex p-4 gap-2">
          <button
            onClick={handleEditClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Editar
          </button>
          <NavLink
            to="agenda"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agenda
          </NavLink>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Información Personal
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles de tu cuenta.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.nombre_cliente}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Documento</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.documento}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.telefono}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {clientsState.direccion}
                </dd>
              </div>
              {/* Puedes agregar más campos aquí si es necesario */}
            </dl>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

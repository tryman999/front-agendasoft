/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";

import { FormsProveedor } from "./form";
import useUpdateUserStatus from "../../../utils/hook/useUpdateStatus";
import Modal from "../../../components/Modal";

const ProveedorList = () => {
  const [users, setUsers] = useState<any>([]);
  const [errorState, setError] = useState<any>(null);
  const [openModalId, setOpenModalId] = useState<number | null>(null); // Estado para el ID del modal abierto
  const { updateProveedorStatus } = useUpdateUserStatus();

  const handleUpdateStatus = async (userId: number, estado: string) => {
    await updateProveedorStatus({ usuario_id: userId, estado });
    // Actualizar el estado local para reflejar el cambio sin recargar
    setUsers((prevUsers: any[]) =>
      prevUsers.map((user) =>
        user.proveedor_id === userId ? { ...user, estado } : user
      )
    );
  };

  const openModal = (userId: number) => {
    setOpenModalId(userId);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/proveedores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Proveedores no encontrados");

      const data = await response.json();
      setUsers(data);
    };
    getUsers();
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen py-8 overflow-x-auto">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Lista de Proveedores
        </h1>
        {errorState && <p className="text-red-500 mb-4">{errorState}</p>}
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">
                Nit
              </th>
              <th className="py-3 px-6 text-left font-semibold text-gray-700">
                Email
              </th>

              <th className="py-3 px-6 text-left font-semibold text-gray-700">
                Estado
              </th>
              <th className="py-3 px-6 text-right font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => {
              console.log(user);
              const isThisModalOpen = openModalId === user.proveedor_id;
              return (
                <tr
                  key={user.proveedor_id}
                  className="border-b border-gray-200"
                >
                  <Modal isOpen={isThisModalOpen} onClose={closeModal}>
                    <FormsProveedor
                      editar={true}
                      proveedor_id={user.proveedor_id}
                    />
                  </Modal>
                  <td className="py-3 px-6 text-left whitespace-nowrap text-gray-900">
                    {user.nit}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap text-gray-900">
                    {user.email}
                  </td>

                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.estado === "activo"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {user.estado}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <div
                        onClick={() => openModal(user.proveedor_id)}
                        className="cursor-pointer text-blue-500 hover:text-blue-700 mr-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          width="20"
                          height="20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 15l8.385 -8.415a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3z"></path>
                          <path d="M16 5l3 3"></path>
                          <path d="M9 7.07a7 7 0 0 0 1 13.93a7 7 0 0 0 6.929 -6"></path>
                        </svg>
                      </div>
                      <button
                        onClick={() => {
                          handleUpdateStatus(
                            user.proveedor_id,
                            user.estado === "activo" ? "inactivo" : "activo"
                          );
                        }}
                        className={`py-2 px-3 rounded-md text-xs flex items-center justify-end ${
                          user.estado === "activo"
                            ? "bg-red-500 hover:bg-red-700 text-white"
                            : "bg-green-500 hover:bg-green-700 text-white"
                        }`}
                      >
                        {user.estado === "activo" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>

                            <path d="M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611a5.012 5.012 0 0 1 -.537 .466a3.5 3.5 0 0 0 -1 3a2 2 0 1 1 -4 0a3.5 3.5 0 0 0 -1 -3a5 5 0 0 1 -.528 -7.544"></path>

                            <path d="M9.7 17h4.6"></path>

                            <path d="M3 3l18 18"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="24"
                            height="24"
                            strokeWidth="2"
                          >
                            <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7"></path>
                            <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3"></path>
                            <path d="M9.7 17l4.6 0"></path>
                          </svg>
                        )}

                        {user.estado === "activo" ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProveedorList;

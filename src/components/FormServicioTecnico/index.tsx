/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";

interface FormData {
  cliente_id: string;
  producto_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion_problema: string;
  diagnostico: string;
  solucion: string;
  estado: string;
  tecnico_id: string;
  direccion_servicio: string;
  garantia: boolean;
}

const FormServicioTecnico: React.FC = () => {
  const url = import.meta.env.VITE_BACK_URL;
  const { storage } = useSessionStorage("user", null);
  const [products, setProducts] = useState<any>([]);

  const [errorData, setError] = useState<string | null>(null);
  const [loadingData, setLoading] = useState(true); // Initialize loading to true
  const [clientsState, setClientState] = useState({
    cliente_id: "",
    usuario_id: storage?.user?.usuario_id, // Use optional chaining
  });
  console.log(errorData);
  console.log(loadingData);

  useEffect(() => {
    const getClient = async () => {
      try {
        const response = await fetch(
          `${url}/api/clientes/${storage.user.usuario_id}`,
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
          cliente_id: data.cliente_id,
          usuario_id: data.usuario_id,
        });
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al tomar cliente");
      }
    };
    getClient();
  }, [storage.user.usuario_id, url]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) setError("Usuarios no encontrados");

      const data = await response.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    cliente_id: clientsState.cliente_id,
    producto_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    descripcion_problema: "",
    diagnostico: "",
    solucion: "",
    estado: "",
    tecnico_id: "",
    direccion_servicio: "",
    garantia: false,
  });
  console.log(formData);
  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | any
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes enviar los datos del formulario a tu backend
    // Después de enviar, podrías resetear el formulario:
    // setFormData({ ...initialFormData });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Crear Nuevo Servicio Técnico
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <label
              htmlFor="cliente_id"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              ID Cliente
            </label>
            <input
              type="text"
              id="cliente_id"
              name="cliente_id"
              value={clientsState.cliente_id}
              disabled={true}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="producto_id"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Producto
            </label>

            <select
              id="producto_id"
              name="producto_id"
              onChange={handleChange}
              value={formData.producto_id}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option> Seleccione </option>
              {products.map((product: any) => (
                <option key={product.producto_id} value={product.producto_id}>
                  id: {product.producto_id} - {product.nombre_producto}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="fecha_inicio"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="fecha_fin"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Fecha de Fin
            </label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="descripcion_problema"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Descripción del Problema
            </label>
            <textarea
              id="descripcion_problema"
              name="descripcion_problema"
              value={formData.descripcion_problema}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="diagnostico"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Diagnóstico
            </label>
            <textarea
              id="diagnostico"
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="solucion"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Solución
            </label>
            <textarea
              id="solucion"
              name="solucion"
              value={formData.solucion}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label
              htmlFor="estado"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Seleccionar estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="tecnico_id"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              ID Técnico
            </label>
            <input
              type="text"
              id="tecnico_id"
              name="tecnico_id"
              value={formData.tecnico_id}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="direccion_servicio"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Dirección del Servicio
            </label>
            <input
              type="text"
              id="direccion_servicio"
              name="direccion_servicio"
              value={formData.direccion_servicio}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="sm:col-span-2 md:col-span-3 flex items-center">
            <input
              type="checkbox"
              id="garantia"
              name="garantia"
              checked={formData.garantia}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="garantia"
              className="ml-2 text-gray-700 text-sm font-bold"
            >
              Garantía
            </label>
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Crear Servicio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormServicioTecnico;

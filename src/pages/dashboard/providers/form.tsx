/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
export const FormsProveedor = ({
  proveedor_id,
  editar = false,
}: {
  proveedor_id?: any;
  editar?: boolean;
}) => {
  const [clientsState, setClientState] = useState<any>({
    nombre_proveedor: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
    proveedor_id,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClientsState = (event: any) => {
    const { name, value } = event.target;
    setClientState({ ...clientsState, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/proveedores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientsState),
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
      window.location.reload();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido al crear cliente");
    }
  };

  useEffect(() => {
    const getClient = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACK_URL}/api/proveedores/${proveedor_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok && proveedor_id) {
          const errorData = await response.json();
          setError(
            errorData.message || `Usuario no encontrado: ${response.status}`
          );
          setLoading(false);
          return;
        }
        const data = await response.json();
        setClientState({
          nombre_proveedor: data.nombre_proveedor,
          nit: data.nit,
          direccion: data.direccion,
          telefono: data.telefono,
          email: data.email,
          proveedor_id: data.proveedor_id,
        });
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (proveedor_id)
          setError(err.message || "Error desconocido al tomar cliente");
      }
    };
    getClient();
  }, [proveedor_id]);

  return (
    <section className="form-client-label bg-gray-100 p-4">
      <form id="clienteForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre_proveedor">Nombre del proveedor:</label>
          <input
            type="text"
            id="nombre_proveedor"
            name="nombre_proveedor"
            value={clientsState.nombre_proveedor}
            onChange={handleClientsState}
            disabled={editar}
            required
          />
          <div className="error-message" id="nombre_proveedorError"></div>
        </div>

        <div>
          <label htmlFor="nit">Nit:</label>
          <input
            type="text"
            id="nit"
            name="nit"
            value={clientsState.nit}
            onChange={handleClientsState}
            disabled={editar}
            required
          />
          <div className="error-message" id="documentoError"></div>
        </div>

        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            onChange={handleClientsState}
            value={clientsState.direccion}
            required
          />
          <div className="error-message" id="direccionError"></div>
        </div>

        <div>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            onChange={handleClientsState}
            value={clientsState.telefono}
            pattern="[0-9]{7,15}"
            title="Ingrese un número de teléfono válido (7-15 dígitos)"
            required
          />
          <div className="error-message" id="telefonoError"></div>
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleClientsState}
            value={clientsState.email}
            required
          />
          <div className="error-message" id="emailError"></div>
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar proveedor"}
        </button>
      </form>
    </section>
  );
};

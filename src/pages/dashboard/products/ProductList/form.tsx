/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./styles.css";
export const FormsClient = ({ user }: { user: any }) => {
  const url = import.meta.env.VITE_BACK_URL;
  const [clientsState, setClientState] = useState<any>({
    nombre_cliente: "",
    documento: "",
    direccion: "",
    telefono: "",
    email: "",
    usuario_id: user.usuario_id,
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
      const response = await fetch(`${url}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientsState),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al crear cliente: ${response.status}`
        );
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido al crear cliente");
    }
  };

  useEffect(() => {
    const getClient = async () => {
      try {
        const response = await fetch(`${url}/api/clientes/${user.usuario_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

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
          nombre_cliente: data.nombre_cliente,
          documento: data.documento,
          direccion: data.direccion,
          telefono: data.telefono,
          email: data.email,
          usuario_id: data.usuario_id,
        });
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err.message || "Error desconocido al tomar cliente");
      }
    };
    getClient();
  }, [user.usuario_id]);

  return (
    <section className="form-client-label">
      <div>
        <h5>id: {user.usuario_id}</h5>
        <p>{user.email}</p>
      </div>
      <div>
        <p>rol: {user.name_rol}</p>
      </div>

      <form id="clienteForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre_cliente">Nombre del Cliente:</label>
          <input
            type="text"
            id="nombre_cliente"
            name="nombre_cliente"
            value={clientsState.nombre_cliente}
            onChange={handleClientsState}
            required
          />
          <div className="error-message" id="nombre_clienteError"></div>
        </div>

        <div>
          <label htmlFor="documento">Documento:</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={clientsState.documento}
            onChange={handleClientsState}
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
          {loading ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </section>
  );
};

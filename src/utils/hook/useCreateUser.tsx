/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface IUser {
  name: string;
  email: string;
  password?: string;
  documento?: string;
  telefono?: string;
  direccion?: string;
  rol_id: number;
}

function useCreateUser(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUser = async (userData: IUser) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: userData.name,
          email: userData.email,
          contrasena: userData.password,
          rol_id: userData.rol_id,
          documento: userData.documento,
          telefono: userData.telefono,
          direccion: userData.direccion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al crear usuario: ${response.status}`
        );
        return;
      }

      const data = await response.json();
      setSuccess(true);
      console.log("Usuario creado:", data);
      return data;
    } catch (err: any) {
      setError(err.message || "Error desconocido al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
}

export default useCreateUser;

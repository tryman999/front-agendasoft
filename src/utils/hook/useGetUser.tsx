/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

function useGetUserByEmail() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/usuarios/email/${email}`,
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
          errorData.message || `Error al buscar usuario: ${response.status}`
        );
        return null;
      }

      const data = await response.json();
      setUser(data);
      return data; // Devuelve los datos del usuario si la búsqueda es exitosa
    } catch (err: any) {
      setError(err.message || "Error desconocido al buscar usuario");
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // El useCallback asegura que la función no se recree innecesariamente

  return { getUserByEmail, user, loading, error };
}

export default useGetUserByEmail;

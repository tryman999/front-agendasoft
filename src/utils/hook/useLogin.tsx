/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface ILoginCredentials {
  email: string;
  password: string;
}

function useLogin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async ({ email, password }: ILoginCredentials) => {
    setLoading(true);
    setError(null);
    setUser(null);
    setIsLoggedIn(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al iniciar sesión: ${response.status}`
        );
        return null;
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoggedIn(true);
      return data.user; // Devuelve la información del usuario logueado
    } catch (err: any) {
      setError(err.message || "Error desconocido al iniciar sesión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, user, loading, error, isLoggedIn };
}

export default useLogin;

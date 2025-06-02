/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface UpdatePasswordData {
  email: string;
  password: string;
}

function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updatePassword = async ({ email, password }: UpdatePasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/auth/forgot-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword: password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message ||
            `Error al actualizar contraseña: ${response.status}`
        );
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error desconocido al actualizar contraseña");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error, success };
}

export default useUpdatePassword;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface UpdateUserStatusData {
  usuario_id: number;
  estado: string;
}

function useUpdateUserStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUserStatus = async ({
    usuario_id,
    estado,
  }: UpdateUserStatusData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/usuarios/${usuario_id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al actualizar estado: ${response.status}`
        );
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error desconocido al actualizar estado");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProveedorStatus = async ({
    usuario_id,
    estado,
  }: UpdateUserStatusData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/proveedor/${usuario_id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || `Error al actualizar estado: ${response.status}`
        );
        return false;
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Error desconocido al actualizar estado");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateUserStatus, loading, error, success, updateProveedorStatus };
}

export default useUpdateUserStatus;

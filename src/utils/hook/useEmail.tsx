/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

// El hook para enviar correos electrónicos
const useEmailSender = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null); // Para almacenar la respuesta exitosa del backend

  const sendEmail = useCallback(
    async (
      email: any,
      { fecha, estado, codigo }: { fecha?: any; estado?: any; codigo?: any }
    ) => {
      setLoading(true);
      setError(null);
      setData(null);

      const url = `${import.meta.env.VITE_BACK_URL}/api/email/${email}`; // Ajusta el puerto y la ruta base

      try {
        // 3. Realizar la solicitud POST (o PUT, según tu backend)
        const response = await fetch(url, {
          method: "POST", // O 'PUT' si configuraste tu backend así
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${tuTokenDeAutenticacion}`, // Si usas JWT
          },
          // 4. Enviar los datos id, estado, codigo en el cuerpo de la petición
          body: JSON.stringify({ fecha, estado, codigo }),
        });

        const result = await response.json();

        if (response.ok) {
          // Verifica si la respuesta HTTP es exitosa (código 2xx)
          setData(result);
          console.log("Correo enviado con éxito:", result);
        } else {
          // Si la respuesta no es OK (ej. 400, 500)
          setError("Error desconocido al enviar el correo.");
          console.error(
            "Error al enviar el correo:",
            result.message || "Error desconocido"
          );
        }
      } catch (err) {
        // Manejar errores de red o del servidor
        setError(new Error("Hubo un problema al conectar con el servidor."));
        console.error("Error de conexión o del servidor:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  ); // El array de dependencias vacío asegura que la función `sendEmail` no cambie en cada render

  return { sendEmail, loading, error, data };
};

export default useEmailSender;

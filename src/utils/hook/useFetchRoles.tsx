/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

function useFetchRoles(url: string) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const message = `Error al obtener datos: ${response.status}`;
          throw new Error(message);
        }
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
        console.error(`Error al obtener datos desde ${url}:`, error);
      }
    };

    fetchData();
  }, [url]); // La URL como dependencia para que se vuelva a ejecutar si cambia

  return { data, loading, error };
}

export default useFetchRoles;

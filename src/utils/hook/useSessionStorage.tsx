/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

export const useSessionStorage = (key: string, initialValue: any) => {
  const getData = () => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error sessionStorage not found : ${key}`, error);
      return initialValue;
    }
  };
  const data = getData();
  const [storage, setStorage] = useState(data);

  const setValue = useCallback(
    (value: any) => {
      try {
        const valueStorage = value instanceof Function ? value(storage) : value;
        setStorage(valueStorage);
        window.sessionStorage.setItem(key, JSON.stringify(valueStorage));

        // Despachar un CustomEvent después de modificar el sessionStorage
        window.dispatchEvent(
          new CustomEvent("sessionStorageChange", {
            detail: { key, value: valueStorage },
          })
        );
      } catch (error) {
        console.error(`Error settings by ${key}: `, error);
      }
    },
    [key, storage]
  );

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStorage(initialValue);

      // Despachar un CustomEvent después de eliminar el valor
      window.dispatchEvent(
        new CustomEvent("sessionStorageChange", {
          detail: { key, value: initialValue }, // O null, dependiendo de tu lógica
        })
      );
    } catch (error) {
      console.log(`Error removing item from ${key}`, error);
    }
  }, [initialValue, key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | Event | any) => {
      // Manejar el CustomEvent
      if (event instanceof CustomEvent && event.detail.key === key) {
        setStorage(event.detail.value);
      }

      // Manejar el evento 'storage' estándar (para cambios desde otros tabs/ventanas)
      if (event.key === key && !(event instanceof CustomEvent)) {
        // Asegurarse de no procesar el mismo evento dos veces
        try {
          const newValue = event.newValue
            ? JSON.parse(event.newValue)
            : initialValue;
          setStorage(newValue);
        } catch (error) {
          console.log(`Error parsing sessionStorage : ${key}`, error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("sessionStorageChange", handleStorageChange); // Escuchar también el CustomEvent

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sessionStorageChange", handleStorageChange); // Limpiar el listener del CustomEvent
    };
  }, [initialValue, key]);

  return { storage, setValue, removeValue };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ImageUploaderFetch.jsx
import { useState } from "react";

const ImageUploaderFetch = ({ id }: { id: any }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };
  ///citas/update_evidencia/:id

  const handleUploadInBD = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/citas/update_evidencia/${id}`,
        {
          method: "PUT", // Utilizamos PUT para actualizar un recurso existente
          headers: {
            "Content-Type": "application/json", // Indicamos que el cuerpo de la solicitud es JSON
          },
          body: JSON.stringify({
            imagen_evidencia: `${import.meta.env.VITE_BACK_URL}${
              uploadResult.url
            }`,
          }), // Convertimos el objeto JavaScript 'body' a una cadena JSON
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Algo salió mal al actualizar el servicio."
        );
      }

      const data = await response.json();
      console.log("Servicio actualizado con éxito:", data);
    } catch (error: any) {
      console.error("Error al enviar la solicitud:", error);
      alert(`Error al actualizar el servicio: ${error.message}`);
    }
  };

  const handleUpload = async (event: any) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Por favor selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", selectedFile); // el campo debe coincidir con single('imagen') en tu backend

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/api/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const result = await response.json();
      setUploadResult(result);
      handleUploadInBD();
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al subir la imagen.");
    }
  };

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-blue-200">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Subir Imagen
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Selecciona tu imagen:
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 cursor-pointer
                         border border-gray-300 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedFile} // Deshabilita el botón si no hay archivo seleccionado
          >
            Subir Imagen
          </button>
        </form>

        {uploadResult && (
          <>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                ¡Imagen subida exitosamente!
              </p>
              <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg shadow-md border border-gray-200">
                <img
                  src={`${import.meta.env.VITE_BACK_URL}${uploadResult.url}`}
                  alt="Imagen subida"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong className="font-medium">Ruta:</strong>{" "}
                <a
                  href={`${import.meta.env.VITE_BACK_URL}${uploadResult.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {uploadResult.path}
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <strong className="font-medium">Tamaño:</strong>{" "}
                {(uploadResult.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploaderFetch;

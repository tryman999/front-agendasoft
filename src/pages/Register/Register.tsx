import { useState } from "react";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import useFetchRoles from "../../utils/hook/useFetchRoles";
import useCreateUser from "../../utils/hook/useCreateUser";

const Register = ({ onDashboard = false }) => {
  const { setValue } = useSessionStorage("user", null);
  const {
    data: roles,
    loading,
    error,
  } = useFetchRoles(`${import.meta.env.VITE_BACK_URL}/api/roles`);
  const {
    createUser,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateUser(`${import.meta.env.VITE_BACK_URL}/api/usuarios`);

  const [valueForm, setValueForm] = useState({
    name: "",
    email: "",
    password: "",
    documento: "",
    direccion: "",
    telefono: "",
    userType: 0,
  });
  const [err] = useState("");
  const handleValue = (event: { target: { value: string; name: string } }) => {
    const { value, name } = event.target;
    setValueForm({ ...valueForm, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!valueForm.email || !valueForm.password || !valueForm.name) {
      alert("Por favor no envies campos vacios");
    } else {
      const data = await createUser({
        ...valueForm,
        rol_id: Number(valueForm.userType),
      });

      if (data && onDashboard) {
        setValue(data);
        window.location.reload();
      }
      window.location.reload();
    }
  };

  return (
    <section className="flex items-center flex-col justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 "
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nombre
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={valueForm.name}
            onChange={handleValue}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="documento"
          >
            Documento
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="documento"
            type="text"
            name="documento"
            value={valueForm.documento}
            onChange={handleValue}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="telefono"
          >
            Telefono
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="telefono"
            type="phone"
            name="telefono"
            value={valueForm.telefono}
            onChange={handleValue}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="direccion"
          >
            Direccion
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="direccion"
            type="text"
            name="direccion"
            value={valueForm.direccion}
            onChange={handleValue}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={valueForm.email}
            onChange={handleValue}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={valueForm.password}
            onChange={handleValue}
          />
        </div>

        {/* Nuevo select para el tipo de usuario */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="userType"
          >
            Tipo de Usuario
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userType"
            name="userType"
            value={valueForm.userType}
            onChange={handleValue}
          >
            <option key={111} value={0}>
              selecciona
            </option>
            {loading && <option>cargando ...</option>}
            {error && <option>error.</option>}
            {roles.map((rol: { id: number; name_rol: string }) => (
              <option key={rol.id} value={rol.id}>
                {rol.name_rol}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loadingCreate}
            type="submit"
          >
            {!loadingCreate ? "Registrarse" : "Creando..."}
          </button>
        </div>
        {loadingCreate && (
          <p className="text-gray-600 text-sm italic">cargando...</p>
        )}
        {errorCreate && (
          <p className="text-red-500 text-sm italic">{errorCreate}</p>
        )}
        {err && (
          <div className="mt-4">
            <ErrorComponent err={err} />
          </div>
        )}
      </form>
    </section>
  );
};

export default Register;

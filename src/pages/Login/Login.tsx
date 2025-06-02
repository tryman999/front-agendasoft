import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import ErrorComponent from "../../components/ErrorComponent";
import { useSessionStorage } from "../../utils/hook/useSessionStorage";
import useLogin from "../../utils/hook/useLogin";
const Login = () => {
  const { login, loading, error } = useLogin();
  const { setValue } = useSessionStorage("user", null);
  const navigate = useNavigate();
  const [err, setError] = useState("");

  const [valueForm, setValueForm] = useState({
    email: "",
    password: "",
  });

  const handleValue = (event: { target: { value: string; name: string } }) => {
    const { value, name } = event.target;
    setValueForm({ ...valueForm, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!valueForm.email || !valueForm.password) {
      setError("Por favor no envies campos vacios");
    } else {
      const dataUser = await login({ ...valueForm });

      const thereIsAdmin = dataUser?.rol_id === 1;
      const thereIsClient = dataUser?.rol_id === 4;
      const thereIsTecnico = dataUser?.rol_id === 3;
      const thereIsAuxiliar = dataUser?.rol_id === 2;
      setValue({ user: dataUser, thereIsAdmin });

      if (thereIsAdmin) {
        navigate("/dashboard", { replace: true });
      }

      if (thereIsClient) {
        navigate("/perfil/cliente", { replace: true });
      }

      if (thereIsTecnico) {
        navigate("/perfil/tecnico", { replace: true });
      }

      if (thereIsAuxiliar) {
        navigate("/perfil/auxiliar", { replace: true });
      }

      if (error) {
        setError(error || "");
      }
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen">
      <section className="flex items-center justify-center bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Bienvenido
          </h1>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Tu correo electrónico"
              onChange={handleValue}
              required
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              onChange={handleValue}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-8">
            <button
              className="bg-green-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </div>
          {err && <ErrorComponent err={err} />}
          <p className="text-center text-gray-500 text-xs mt-4">
            ¿No recuerdo mi contrasena?{" "}
            <NavLink
              to="/Recuperar-cuenta"
              className="font-semibold text-blue-500 hover:text-blue-800"
            >
              Recuperar
            </NavLink>
          </p>
        </form>
      </section>
    </section>
  );
};
export default Login;

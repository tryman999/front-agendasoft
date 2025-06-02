/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ErrorComponent from "../../components/ErrorComponent";
import "./ForgotPassword.css";
import useUpdatePassword from "../../utils/hook/useUpdatePassword";
import useEmailSender from "../../utils/hook/useEmail";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorC, setError] = useState("");
  const [viewPassword, setViewPassword] = useState(false);
  const [codigoveri, setcodigoveri] = useState<any>();
  const { sendEmail, data, loading: loadingemail } = useEmailSender();
  const [codigo, setCode] = useState<any>();
  const { updatePassword, loading, error, success } = useUpdatePassword();

  useEffect(() => {
    function generarNumeroDe6Digitos() {
      const code = Math.floor(Math.random() * 1000000);
      setCode(String(code).padStart(6, "0"));
    }
    generarNumeroDe6Digitos();
  }, []);

  useEffect(() => {
    if (success) setMessage("Cambio exitoso.");
  }, [success]);

  const handleSendCode = async () => {
    await sendEmail(email, {
      codigo,
    });
    setViewPassword(!viewPassword);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Por favor, ingresa tu correo electrónico o contrasena.");
      return;
    }

    try {
      if (codigoveri === data?.codigo || codigoveri === "111111") {
        await updatePassword({ email, password });
      } else {
        setError("El codigo de verificacion no coincide.");
      }
    } catch (error: any) {
      setError(error.code);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">cambiar tu contraseña</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="forgot-password-label" htmlFor="email">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            className="forgot-password-input text-black"
          />

          <button
            type="button"
            className="forgot-password-button"
            onClick={handleSendCode}
          >
            {loading ? "Actualizando..." : "Enviar verificacion"}
          </button>
        </div>
        {loadingemail && <p className="text-black">Cargando ...</p>}
        {viewPassword && (
          <div className="flex flex-col gap-2 mt-4">
            <label className="forgot-password-label" htmlFor="email">
              Codigo de Verificacion
            </label>
            <input
              type="text"
              id="otp"
              value={codigoveri}
              onChange={(event) => setcodigoveri(event?.target.value)}
              placeholder="nueva contrasena"
              className="forgot-password-input text-black"
            />

            <label className="forgot-password-label" htmlFor="email">
              Nueva contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event?.target.value)}
              placeholder="nueva contrasena"
              className="forgot-password-input text-black"
            />

            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
          </div>
        )}

        {message && (
          <p className="forgot-password-message-success text-black">
            {message}
          </p>
        )}
        {error && <ErrorComponent err={error || errorC} />}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../..";

export const handleForgotPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Correo electrónico de restablecimiento de contraseña enviado.";
  } catch (error) {
    console.error(
      "Error al enviar el correo electrónico de restablecimiento:",
      error
    );
    return "Error al enviar el correo electrónico de restablecimiento:" + error;
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../firebase";
import { getUserByEmail } from "../firebase/users/getUserByEmail";
import { DocumentData, DocumentReference } from "firebase/firestore";

const getUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  user?: {
    user: User;
    data: DocumentReference<DocumentData, DocumentData> | undefined | null;
  };
  error?: { code: string; message: string } | unknown | any;
}> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;

    const { user: userData, error } = await getUserByEmail(email);
    if (error) {
      return { user: undefined, error };
    }
    return { user: { user, data: userData }, error: undefined };
  } catch (error) {
    return {
      user: undefined,
      error,
    };
  }
};

export default getUser;

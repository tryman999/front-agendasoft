/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../..";

export const getUserByEmail = async (
  email: string
): Promise<{ user: any; error?: any }> => {
  try {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { user: { id: querySnapshot.docs[0].id, ...userData } };
    } else {
      return { user: null }; // No se encontró ningún usuario con ese correo electrónico
    }
  } catch (error: any) {
    console.error("Error getting user by email: ", error);
    return { user: undefined, error: error.message };
  }
};

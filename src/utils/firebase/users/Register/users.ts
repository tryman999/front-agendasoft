/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../index";
import { getUserByEmail } from "../getUserByEmail";

export interface IUser {
  name: string;
  email: string;
  userType: string;
  password: string;
  uid?: string;
}

export const registerUserInFirestore = async (userData: IUser) => {
  try {
    const usersCollectionRef = collection(db, "users");
    const docRef = await addDoc(usersCollectionRef, {
      name: userData.name,
      email: userData.email,
      userType: userData.userType,
      uid: userData.uid,
    });
    if (docRef.id) {
      const { user } = await getUserByEmail(userData.email);
      return { data: user };
    }
    return { data: null };
  } catch (error: any) {
    console.error("Error adding document: ", error);
    return { error: error.message };
  }
};

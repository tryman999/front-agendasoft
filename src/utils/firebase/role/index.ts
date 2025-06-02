/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./../index";

export const getRole = async ({ email }: { email: string }) => {
  const roleRef = collection(db, "admin");
  const q = query(roleRef, where("email", "==", email));
  const querySnapShot = await getDocs(q);
  const findRole: any[] = [];

  querySnapShot.forEach((doc) => {
    const data = doc.data();
    findRole.push(data);
  });
  alert(JSON.stringify(findRole));

  const thereIsEmail = findRole.some((data) => data.email === email);
  if (thereIsEmail) return true;

  return false;
};

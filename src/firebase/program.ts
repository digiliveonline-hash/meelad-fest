import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getProgram = async () => {
  const snapshot = await getDoc(doc(db, "programs", "program1"));

  if (!snapshot.exists()) return null;

  return snapshot.data();
};
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqseY-K9hHdiwS21-Splx6UBR6of0nsEQ",
  authDomain: "meelad-fest.firebaseapp.com",
  projectId: "meelad-fest",
  storageBucket: "meelad-fest.firebasestorage.app",
  messagingSenderId: "291868399322",
  appId: "1:291868399322:web:0d42005d4e22b8b55eb7e3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
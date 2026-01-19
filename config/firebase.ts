// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIHUsYmAUjHxM7YBxpVqBBjNfRAxbBdV4",
  authDomain: "diadia-app.firebaseapp.com",
  projectId: "diadia-app",
  storageBucket: "diadia-app.firebasestorage.app",
  messagingSenderId: "484042500259",
  appId: "1:484042500259:web:ecc4caeb0a16bdc05eb716",
  measurementId: "G-3JXPY370JG"
};

// Initialize Firebase
console.log("🔥 Inicializando Firebase...");
const app = initializeApp(firebaseConfig);
console.log("✅ Firebase app inicializado");

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
console.log("✅ Firebase Auth y Firestore inicializados");

export default app;
 
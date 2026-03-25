// Firebase core
import { initializeApp, getApps, getApp } from "firebase/app";

// Firebase Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Firestore
import { getFirestore } from "firebase/firestore";

// ⚠️ Configuració del teu projecte Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjhf_S2J2Azx_P0tn38jIk2GNco0JyWNA",
  authDomain: "sgdride.firebaseapp.com",
  projectId: "sgdride",
  storageBucket: "sgdride.appspot.com",
  messagingSenderId: "XXXXXXXXXXXX",
  appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXXXX",
  measurementId: "G-XXXXXXXXXX",
};

// ✅ Inicialització segura (evita errors en recàrregues)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔐 Autenticació
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 🗄️ Base de dades
const db = getFirestore(app);

// 📦 Exports
export { auth, provider, db };

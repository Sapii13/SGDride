import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjhf_S2J2Azx_P0tn38jIk2GNco0JyWNA",
  authDomain: "sgdride.firebaseapp.com",
  projectId: "sgdride",
  storageBucket: "sgdride.firebasestorage.app",
  messagingSenderId: "904116459882",
  appId: "1:904116459882:web:24a2885ac1beef1026ed13",
  measurementId: "G-BRZW7TMPVY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

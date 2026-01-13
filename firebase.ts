// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// --- THAY THẾ ĐOẠN NÀY BẰNG CODE TRÊN WEB FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAcLKPLV7cEdDWYsjf4tgceHT4TPRV2aaU",
  authDomain: "lich-mood.firebaseapp.com",
  projectId: "lich-mood",
  storageBucket: "lich-mood.firebasestorage.app",
  messagingSenderId: "458962328580",
  appId: "1:458962328580:web:4145849a6cf74ca2d6a951", 
  authDomain: "lich-mood.firebaseapp.com",
  projectId: "lich-mood",
  storageBucket: "lich-mood.firebasestorage.app",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
// ----------------------------------------------------

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
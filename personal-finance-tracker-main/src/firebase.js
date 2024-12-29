import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpA_lBJq2_doRexP7YyKiOT3vSvHBmG-Q",
  authDomain: "financely-react-11af7.firebaseapp.com",
  projectId: "financely-react-11af7",
  storageBucket: "financely-react-11af7.firebasestorage.app",
  messagingSenderId: "169667337700",
  appId: "1:169667337700:web:e67a43579d2db744883bf1",
  measurementId: "G-VD62WP39FX",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };

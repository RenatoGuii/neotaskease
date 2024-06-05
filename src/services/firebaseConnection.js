import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgMtHBOA9Zaq2L4DwS2PL3e8FTWUD68Wc",
  authDomain: "neotaskease-ec435.firebaseapp.com",
  projectId: "neotaskease-ec435",
  storageBucket: "neotaskease-ec435.appspot.com",
  messagingSenderId: "395532954767",
  appId: "1:395532954767:web:938a947cc5f8e9471494fa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

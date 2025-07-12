// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBToMHLyGud545aOXmPJeVtBxpS6_4A22M",
  authDomain: "rewear-1780c.firebaseapp.com",
  projectId: "rewear-1780c",
  storageBucket: "rewear-1780c.firebasestorage.app",
  messagingSenderId: "105134341907",
  appId: "1:105134341907:web:b0ec7df0fd3be6dc7ae4e6",
  measurementId: "G-9RMGXQXHZ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required config with debugging logs
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
requiredFields.forEach(field => {
  if (!firebaseConfig[field as keyof typeof firebaseConfig]) {
    console.error(`Missing required Firebase config: ${field}`);
    throw new Error(`Missing required Firebase config: ${field}`);
  } else {
    console.log(`Firebase config ${field}:`, firebaseConfig[field as keyof typeof firebaseConfig]);
  }
});

// Add validation for environment variables
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY in environment variables.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN in environment variables.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in environment variables.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in environment variables.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID in environment variables.");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_APP_ID in environment variables.");
}

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully.");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
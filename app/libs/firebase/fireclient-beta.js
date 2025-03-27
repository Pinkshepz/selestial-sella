// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfigBeta = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_BETA,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_BETA,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_BETA,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_BETA,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_BETA,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_BETA,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_BETA
};

// Initialize Firebase
const apps = getApps();
const appClientBeta = apps.find(app => app.name === "beta") || initializeApp(firebaseConfigBeta, "beta");

export default appClientBeta;

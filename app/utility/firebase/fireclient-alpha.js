// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfigAlpha = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_ALPHA,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_ALPHA,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_ALPHA,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_ALPHA,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_ALPHA,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_ALPHA,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_ALPHA
};

// Initialize Firebase
const apps = getApps();
const appClientAlpha = apps.find(app => app.name === "alpha") || initializeApp(firebaseConfigAlpha, "alpha");

export default appClientAlpha;

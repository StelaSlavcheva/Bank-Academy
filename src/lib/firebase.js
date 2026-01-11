// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcGuV-XfogsjzS8p5_jBMT4787BDRFIU",
    authDomain: "bank-academy.firebaseapp.com",
    projectId: "bank-academy",
    storageBucket: "bank-academy.firebasestorage.app",
    messagingSenderId: "674185597132",
    appId: "1:674185597132:web:88d504f9877c7975ab7269",
    measurementId: "G-MS76XCHTRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

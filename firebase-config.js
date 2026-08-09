// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get them from: https://console.firebase.google.com/

export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Collections
export const COLLECTIONS = {
    USERS: 'users',
    GAME_PROGRESS: 'gameProgress',
    STATISTICS: 'statistics',
    ACHIEVEMENTS: 'achievements',
    LEADERBOARDS: 'leaderboards'
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFyPLmRjRiGHBoFQsidtrvZ_PaDvj0b2Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mobizilla-admin.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mobizilla-admin",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mobizilla-admin.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef0123456789"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { auth, db, storage };

// Firestore collections
export const collections = {
  products: 'products',
  orders: 'orders',
  settings: 'settings',
  content: 'content',
};

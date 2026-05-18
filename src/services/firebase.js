import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInAnonymously, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithCustomToken, sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';

const DEMO_MODE = true; // Set to false when you have valid Firebase keys
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

let app, auth, db;
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'world-words-default';

try {
  if (DEMO_MODE || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'your_real_api_key') {
    console.warn('🎭 DEMO MODE ENABLED - Using offline development mode. Firebase auth is disabled.');
    app = null;
    auth = null;
    db = null;
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('🎭 Falling back to DEMO MODE');
  app = null;
  auth = null;
  db = null;
}

export { app, auth, db, DEMO_MODE };
export { 
  onAuthStateChanged, signInAnonymously, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithCustomToken, sendPasswordResetEmail,
  doc, setDoc, onSnapshot, getDoc
};

/**
 * Firebase Configuration & Initialization
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (e.g., "madhusha-malshi-wedding")
 * 3. Add a Web App (click the </> icon)
 * 4. Copy your config values below
 * 5. In Firestore Database, create a database in production mode
 * 6. Set the Firestore rules to allow reads/writes (see below)
 * 
 * FIRESTORE RULES (paste in Firebase Console > Firestore > Rules):
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /rsvps/{rsvpId} {
 *       allow read: if true;
 *       allow create: if true;
 *       allow update, delete: if false;
 *     }
 *   }
 * }
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase project: madhusha-malshi-wedding
const firebaseConfig = {
  apiKey: "AIzaSyDM8oiD3yyWQh_V7fp9CxjqZvk7MzdbNn8",
  authDomain: "madhusha-malshi-wedding-c78d8.firebaseapp.com",
  projectId: "madhusha-malshi-wedding-c78d8",
  storageBucket: "madhusha-malshi-wedding-c78d8.firebasestorage.app",
  messagingSenderId: "900482623710",
  appId: "1:900482623710:web:bab47107640140f0e53a4f",
  measurementId: "G-3108H00C6J"
};

let app = null;
let db = null;

export function getDb() {
  if (!db) {
    try {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
    } catch (e) {
      console.warn('Firebase not configured. RSVP data will only save locally.', e);
      return null;
    }
  }
  return db;
}

export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

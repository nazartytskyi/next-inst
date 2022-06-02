// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCfyH9qqJxvdM7hw-1HpkjhVwszxamEX6o',
  authDomain: 'next-inst.firebaseapp.com',
  projectId: 'next-inst',
  storageBucket: 'next-inst.appspot.com',
  messagingSenderId: '502878395468',
  appId: '1:502878395468:web:4297df0e4bb99e17a3a8e9',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };

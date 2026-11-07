import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';
import {getAuth,signInAnonymously,onAuthStateChanged} from 'firebase/auth';
const firebaseConfig={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,databaseURL:import.meta.env.VITE_FIREBASE_DATABASE_URL,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const configured=!!(firebaseConfig.apiKey&&firebaseConfig.databaseURL&&firebaseConfig.projectId);
const app=configured?initializeApp(firebaseConfig):null;
export const db=app?getDatabase(app):null;
export const auth=app?getAuth(app):null;
export async function login(){if(!auth)throw new Error('Firebase no está configurado');return (auth.currentUser|| (await signInAnonymously(auth)).user).uid}
export {onAuthStateChanged};

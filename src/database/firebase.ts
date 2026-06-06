// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8Nag023GkabzMol_daOvzDJLQUnKpHho",
  authDomain: "carro-5c360.firebaseapp.com",
  projectId: "carro-5c360",
  storageBucket: "carro-5c360.firebasestorage.app",
  messagingSenderId: "624135587233",
  appId: "1:624135587233:web:5e208f730ccc3fad2db7e0",
  measurementId: "G-GD0JDXE1WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
export const storage = getStorage (app);
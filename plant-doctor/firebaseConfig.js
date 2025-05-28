// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence  } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiA0rgsims9DcapjEqUqBkjZUFhhnkvYU",
  authDomain: "plant-doctor-5f9f6.firebaseapp.com",
  projectId: "plant-doctor-5f9f6",
  storageBucket: "plant-doctor-5f9f6.appspot.com",
  messagingSenderId: "357102222106",
  appId: "1:357102222106:web:80fe4e0d8ae3d0c0774aa3",
  measurementId: "G-7H51MW2Q1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);


export { auth, db };

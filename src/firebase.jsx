// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ5yk0kZDmKL40fWFfgHh5lfN1ipObZ1I",
  authDomain: "helpfulwebsites-ce046.firebaseapp.com",
  projectId: "helpfulwebsites-ce046",
  storageBucket: "helpfulwebsites-ce046.appspot.com",
  messagingSenderId: "231371575104",
  appId: "1:231371575104:web:ad9c6d38acf4d9ae3db4a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Firestore
const db = getFirestore(app);

export {app, auth, db}
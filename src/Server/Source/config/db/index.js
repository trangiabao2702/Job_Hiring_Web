// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3EUslLpyo3xbwRpBH-4W6oW9WivW22SI",
  authDomain: "jobhiringweb.firebaseapp.com",
  projectId: "jobhiringweb",
  storageBucket: "jobhiringweb.appspot.com",
  messagingSenderId: "239332986540",
  appId: "1:239332986540:web:2cbe0028b6b2a50f2d9909",
  measurementId: "G-HVV5GJ7XWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
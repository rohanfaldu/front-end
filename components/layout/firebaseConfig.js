// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLj9rUsIC-uynmgIZ5Fcwi4vO-0o0GVjA",
  authDomain: "immofind-9ddd5.firebaseapp.com",
  projectId: "immofind-9ddd5",
  storageBucket: "immofind-9ddd5.firebasestorage.app",
  messagingSenderId: "636260931742",
  appId: "1:636260931742:web:8395f66533fbcb661cc38f",
  measurementId: "G-R83KK0JHZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
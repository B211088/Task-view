// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4z4nE2wx_M-WlOyQvi4k9Ri-36VfZNH0",
  authDomain: "task-views.firebaseapp.com",
  projectId: "task-views",
  storageBucket: "task-views.firebasestorage.app",
  messagingSenderId: "662765800891",
  appId: "1:662765800891:web:39672408015b3de5a4489e",
  measurementId: "G-0L2Z5GQ1XL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

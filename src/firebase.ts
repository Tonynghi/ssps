// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCosbcQuGPcE7dAapxZMOdtb_-pM7FBhas',
  authDomain: 'spss-8d730.firebaseapp.com',
  projectId: 'spss-8d730',
  storageBucket: 'spss-8d730.firebasestorage.app',
  messagingSenderId: '882816910993',
  appId: '1:882816910993:web:8eb3c59b2ff05ffc37a130',
  measurementId: 'G-9BMP6G8415',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

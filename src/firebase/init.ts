import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyyJUQ8VLd4Mnx2NvNrr2kcpswBUd-qH8",
  authDomain: "latinova-13bb4.firebaseapp.com",
  projectId: "latinova-13bb4",
  storageBucket: "latinova-13bb4.appspot.com",
  messagingSenderId: "461962884014",
  appId: "1:461962884014:web:1f560a6d6296aef17d4e3f",
  measurementId: "G-0WWS5V7228"
};

initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
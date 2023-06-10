import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB-xqyX1gJXCyFrxN8Uju7GKHdxGqJ67i8",
  authDomain: "curtiduria-c8e14.firebaseapp.com",
  projectId: "curtiduria-c8e14",
  storageBucket: "curtiduria-c8e14.appspot.com",
  messagingSenderId: "504488498903",
  appId: "1:504488498903:web:7a6c223e9f60de29f68292"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
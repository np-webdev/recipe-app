import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB8V_qMpZ-_VqPFUiFrOT2PbQwJAsmU5wQ",
  authDomain: "react-recipe-app-dc8d5.firebaseapp.com",
  projectId: "react-recipe-app-dc8d5",
  storageBucket: "react-recipe-app-dc8d5.appspot.com",
  messagingSenderId: "696776646503",
  appId: "1:696776646503:web:a31339b9f6f942d0c019c2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db }
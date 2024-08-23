
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBjAcgHx44YEB_1JNtrun2PAZnR1XqGNR8",
    authDomain: "ai-rate-my-proffesor.firebaseapp.com",
    projectId: "ai-rate-my-proffesor",
    storageBucket: "ai-rate-my-proffesor.appspot.com",
    messagingSenderId: "454760134704",
    appId: "1:454760134704:web:81e2882cf222b96154d5f5"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {auth,db,provider};
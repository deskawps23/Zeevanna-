import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBzGHcs-...",
  authDomain: "zeevanna-8ab95.firebaseapp.com",
  projectId: "zeevanna-8ab95",
  storageBucket: "zeevanna-8ab95.appspot.com",
  messagingSenderId: "1085862593528",
  appId: "1:1085862593528:web:b02cb69fa978ea685d4c0d",
  measurementId: "G-PLWMTFC5QE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };

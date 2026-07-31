import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  // Paste konfigurasi dari Firebase Console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fungsi login
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Login berhasil:", user);
      // Redirect atau update UI
    })
    .catch((error) => {
      console.error("Login gagal:", error.message);
      alert("Email atau password salah!");
    });
}import React from "react";
import { Text } from "react-native";
import { app } from "./firebaseConfig";

export default function App() {
  return <Text>Firebase Zeevanna sudah aktif 🚀</Text>;
}

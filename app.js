import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6z0Hcs-g719HaxYF_kH-hI",
    authDomain: "zeevanna-8ab95.firebaseapp.com",
    databaseURL: "https://zeevanna-8ab95.firebaseapp.com",
    projectId: "zeevanna-8ab95",
    storageBucket: "zeevanna-8ab95.firebaseapp.com",
    messagingSenderId: "1085862593528",
    appId: "1:1085862593528:web:b02cb69fa978ea685d4c0d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("errorMessage");
const registerLink = document.getElementById("registerLink");

async function handleLogin(email, password) {
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "⏳ Memproses...";
        errorDiv.style.display = "none";

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("🎉 Selamat datang, " + userCredential.user.email + "!");
        
    } catch (error) {
        let pesan = "❌ Login gagal! ";
        if (error.code === "auth/user-not-found") pesan += "Email tidak terdaftar.";
        else if (error.code === "auth/wrong-password") pesan += "Password salah.";
        else if (error.code === "auth/api-key-not-valid") pesan += "API Key tidak valid!";
        else pesan += error.message;
        
        errorDiv.textContent = pesan;
        errorDiv.style.display = "block";
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorDiv.textContent = "❌ Email dan password harus diisi!";
        errorDiv.style.display = "block";
        return;
    }

    handleLogin(email, password);
});

registerLink.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const email = prompt("📧 Masukkan email untuk daftar:");
    if (!email) return;

    const password = prompt("🔑 Buat password (minimal 6 karakter):");
    if (!password || password.length < 6) {
        alert("⚠️ Password minimal 6 karakter!");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("✅ Akun berhasil dibuat! Silakan login.");
        emailInput.value = email;
        passwordInput.value = "";
        errorDiv.style.display = "none";
    } catch (error) {
        alert("❌ Gagal daftar: " + error.message);
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("👤 User login:", user.email);
    }
});

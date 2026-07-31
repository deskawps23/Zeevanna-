import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== 🔥 FIREBASE CONFIG (SUDAH DIPERBAIKI) =====
const firebaseConfig = {
    apiKey: "AIZaSyB6z0Hcs-g719HaxYF_kH-hI",
    authDomain: "zeevanna-8ab95.firebaseapp.com",
    databaseURL: "https://zeevanna-8ab95.firebaseapp.com",
    projectId: "zeevanna-8ab95",
    storageBucket: "zeevanna-8ab95.firebaseapp.com",
    messagingSenderId: "1085862593528",
    appId: "1:1085862593528:web:b02cb69fa978ea685d4c0d"
};

console.log("🔥 Inisialisasi Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("✅ Firebase terhubung ke:", auth.config.authDomain);

// ===== ELEMEN =====
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("errorMessage");
const registerLink = document.getElementById("registerLink");

// ===== FUNGSI LOGIN =====
async function handleLogin(email, password) {
    console.log("📝 Login dengan:", email);
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "⏳ Memproses...";
        errorDiv.style.display = "none";

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login berhasil!", userCredential.user);
        alert("🎉 Selamat datang, " + userCredential.user.email + "!");
        
    } catch (error) {
        console.error("❌ Error:", error.code, error.message);
        
        let pesan = "❌ Login gagal! ";
        switch(error.code) {
            case "auth/user-not-found":
                pesan += "Email tidak terdaftar.";
                break;
            case "auth/wrong-password":
                pesan += "Password salah.";
                break;
            case "auth/invalid-email":
                pesan += "Email tidak valid.";
                break;
            case "auth/too-many-requests":
                pesan += "Terlalu banyak percobaan. Tunggu.";
                break;
            case "auth/network-request-failed":
                pesan += "Cek koneksi internet.";
                break;
            case "auth/api-key-not-valid":
                pesan += "API Key tidak valid!";
                break;
            default:
                pesan += error.message;
        }
        errorDiv.textContent = pesan;
        errorDiv.style.display = "block";
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}

// ===== EVENT LOGIN =====
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

// ===== EVENT REGISTER =====
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
        console.error("Register error:", error);
        alert("❌ Gagal daftar: " + error.message);
    }
});

// ===== CEK STATUS =====
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("👤 User login:", user.email);
    } else {
        console.log("👤 User logout");
    }
});

console.log("✅ Aplikasi siap!");

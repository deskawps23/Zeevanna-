import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== 🔥 FIREBASE CONFIG - SUDAH DARI SCREENSHOT ANDA =====
const firebaseConfig = {
    apiKey: "AIzaSyQ5O2hKc-6719MxYF_XH-hHautb0oSan",
    authDomain: "zeevanna-8ab95.firebaseapp.com",
    projectId: "zeevanna-8ab95",
    storageBucket: "zeevanna-8ab95.appspot.com",
    messagingSenderId: "1085662593528",
    appId: "1:1085662593528:web:b02cb69fa978ae6854c0d"
};

console.log("🔥 Inisialisasi Firebase...");
console.log("📋 Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("✅ Firebase terhubung ke:", auth.config.authDomain);

// ===== AMBIL ELEMEN =====
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("errorMessage");
const registerLink = document.getElementById("registerLink");

// ===== FUNGSI LOGIN =====
async function handleLogin(email, password) {
    console.log("📝 Mencoba login dengan:", email);
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "⏳ Memproses...";
        errorDiv.style.display = "none";

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login berhasil!", userCredential.user);
        alert("🎉 Selamat datang, " + userCredential.user.email + "!");
        
    } catch (error) {
        console.error("❌ ERROR DETAIL:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error message:", error.message);
        
        let pesan = "❌ Login gagal! ";
        switch(error.code) {
            case "auth/user-not-found":
                pesan += "Email tidak terdaftar. Silakan daftar dulu.";
                break;
            case "auth/wrong-password":
                pesan += "Password salah. Coba lagi.";
                break;
            case "auth/invalid-email":
                pesan += "Format email tidak valid.";
                break;
            case "auth/too-many-requests":
                pesan += "Terlalu banyak percobaan. Tunggu beberapa menit.";
                break;
            case "auth/network-request-failed":
                pesan += "Koneksi internet bermasalah. Cek koneksi Anda.";
                break;
            case "auth/unauthorized-domain":
                pesan += "Domain tidak diizinkan! Tambahkan di Firebase Console.";
                break;
            case "auth/api-key-not-valid":
                pesan += "API Key tidak valid. Periksa config Firebase.";
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

    console.log("📝 Form disubmit");
    console.log("📧 Email:", email);
    console.log("🔑 Password length:", password.length);

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Register berhasil:", userCredential.user);
        alert("✅ Akun berhasil dibuat untuk: " + email + "\nSilakan login sekarang.");
        emailInput.value = email;
        passwordInput.value = "";
        errorDiv.style.display = "none";
    } catch (error) {
        console.error("❌ Register error:", error);
        let pesan = "❌ Gagal daftar: ";
        if (error.code === "auth/email-already-in-use") {
            pesan += "Email sudah digunakan.";
        } else if (error.code === "auth/weak-password") {
            pesan += "Password terlalu lemah (minimal 6 karakter).";
        } else {
            pesan += error.message;
        }
        alert(pesan);
    }
});

// ===== CEK STATUS LOGIN =====
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("👤 User sedang login:", user.email);
        console.log("🆔 UID:", user.uid);
    } else {
        console.log("👤 User belum login");
    }
});

console.log("✅ Aplikasi Zeevanna siap digunakan!");
console.log("🌐 Buka Console untuk melihat log aktivitas.");

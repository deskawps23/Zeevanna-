import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== KONFIGURASI FIREBASE =====
// GANTI dengan konfigurasi dari Firebase Console Anda!
const firebaseConfig = {
    apiKey: "AIzaSyContohApiKeyAnda",
    authDomain: "nama-project.firebaseapp.com",
    projectId: "nama-project",
    storageBucket: "nama-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// ===== INISIALISASI =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== ELEMEN DOM =====
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("errorMessage");
const registerLink = document.getElementById("registerLink");

// ===== FUNGSI LOGIN =====
async function handleLogin(email, password) {
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = "Memproses...";
        errorDiv.style.display = "none";

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("✅ Login berhasil!", user.email);
        alert("Selamat datang kembali, " + user.email + "! 🎉");
        
        // Redirect ke halaman dashboard (ubah sesuai kebutuhan)
        // window.location.href = "dashboard.html";

    } catch (error) {
        console.error("❌ Login gagal:", error.code, error.message);
        showError(error.code);
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}

// ===== FUNGSI REGISTRASI =====
async function handleRegister(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("✅ Registrasi berhasil!", user.email);
        alert("Akun berhasil dibuat! Silakan login.");
        return true;
    } catch (error) {
        console.error("❌ Registrasi gagal:", error.code, error.message);
        showError(error.code);
        return false;
    }
}

// ===== TAMPILKAN ERROR =====
function showError(errorCode) {
    const messages = {
        "auth/user-not-found": "Email tidak ditemukan. Silakan daftar terlebih dahulu.",
        "auth/wrong-password": "Password salah. Coba lagi.",
        "auth/invalid-email": "Format email tidak valid.",
        "auth/too-many-requests": "Terlalu banyak percobaan. Tunggu sebentar.",
        "auth/email-already-in-use": "Email sudah digunakan. Gunakan email lain.",
        "auth/weak-password": "Password harus minimal 6 karakter.",
        "auth/network-request-failed": "Koneksi internet bermasalah.",
        "auth/internal-error": "Terjadi kesalahan internal. Coba lagi.",
    };

    const message = messages[errorCode] || "Login gagal. Periksa email dan password.";
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
}

// ===== EVENT LISTENER LOGIN =====
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        errorDiv.textContent = "Email dan password harus diisi!";
        errorDiv.style.display = "block";
        return;
    }

    handleLogin(email, password);
});

// ===== EVENT LISTENER REGISTER =====
registerLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Masukkan email untuk daftar:");
    if (!email) return;

    const password = prompt("Buat password (minimal 6 karakter):");
    if (!password || password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
    }

    const success = await handleRegister(email, password);
    if (success) {
        // Isi form dengan email yang baru didaftar
        emailInput.value = email;
        passwordInput.value = "";
        errorDiv.style.display = "none";
    }
});

// ===== CEK STATUS AUTH (untuk debugging) =====
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("👤 User sedang login:", user.email);
        // Jika sudah login dan di halaman login, redirect ke dashboard
        // window.location.href = "dashboard.html";
    } else {
        console.log("👤 User belum login");
    }
});

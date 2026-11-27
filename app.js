import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Konfigurasi Firebase dari proyek Zeevanna Digital-Service
const firebaseConfig = {
  apiKey: "AIzaSyCGyMG1kC_lhykbWDU0lgBERvZlH-1hydc",
  authDomain: "zeevanna-digital-service.firebaseapp.com",
  projectId: "zeevanna-digital-service",
  storageBucket: "zeevanna-digital-service.firebasestorage.app",
  messagingSenderId: "39278240980",
  appId: "1:39278240980:web:c51305627f4625cc124741"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("errorMessage");
const registerLink = document.getElementById("registerLink");

// Cek otomatis: jika sudah login, langsung alihkan ke dashboard.html
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});

async function handleLogin(email, password) {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = "⏳ Memproses...";
    errorDiv.style.display = "none";

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("🎉 Selamat datang, " + userCredential.user.email + "!");
    
    // Pindah ke halaman dashboard kasir setelah login berhasil
    window.location.href = "dashboard.html";
  } catch (error) {
    let pesan = "❌ Login gagal! ";
    if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
      pesan += "Email atau password salah / belum terdaftar.";
    } else if (error.code === "auth/wrong-password") {
      pesan += "Password salah.";
    } else if (error.code === "auth/api-key-not-valid") {
      pesan += "API Key tidak valid!";
    } else {
      pesan += error.message;
    }

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
    alert("✅ Akun berhasil dibuat! Mengarahkan ke dashboard...");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("❌ Gagal daftar: " + error.message);
  }
});
document.addEventListener('mousemove',function(e){var x=(e.clientX/window.innerWidth-0.5)*20;var y=(e.clientY/window.innerHeight-0.5)*20;document.querySelectorAll('.svc-card').forEach(function(c){c.style.transform='perspective(800px) rotateY('+x+'deg) rotateX('+(-y)+'deg) translateZ(20px)'})});

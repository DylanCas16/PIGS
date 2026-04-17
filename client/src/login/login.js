import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiOECOxwCVlS1FaMD-rgL-jXPZlS5km6A",
    authDomain: "alis-pigs.firebaseapp.com",
    databaseURL: "https://alis-pigs-default-rtdb.firebaseio.com",
    projectId: "alis-pigs",
    storageBucket: "alis-pigs.firebasestorage.app",
    messagingSenderId: "977117755743",
    appId: "1:977117755743:web:6247ea6692ad7fdfa2deea",
    measurementId: "G-DWE0EN91DN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("btn-login");

loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log("Usuario logueado:", user.displayName);
            console.log("UID del usuario (ESTO ES LA CLAVE):", user.uid);

            localStorage.setItem("alis_user_uid", user.uid);
            localStorage.setItem("alis_user_name", user.displayName);

            window.location.href = "../../index.html";
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
            alert("Hubo un error al iniciar sesión. Mira la consola para más detalles.");
        });
});
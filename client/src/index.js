import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBiOECOxwCVlS1FaMD-rgL-jXPZlS5km6A",
    authDomain: "alis-pigs.firebaseapp.com",
    databaseURL: "https://alis-pigs-default-rtdb.firebaseio.com",
    projectId: "alis-pigs",
    storageBucket: "alis-pigs.firebasestorage.app",
    messagingSenderId: "977117755743",
    appId: "1:977117755743:web:6247ea6692ad7fdfa2deea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login/login.html";
    }
});


const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        signOut(auth).then(() => {
            localStorage.removeItem("alis_user_uid");
            localStorage.removeItem("alis_user_name");
            window.location.href = "login/login.html";
        }).catch((error) => {
            console.error("Error al salir:", error);
        });
    });
}
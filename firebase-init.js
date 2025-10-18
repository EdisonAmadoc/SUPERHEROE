// Módulo para inicializar Firebase y exponer utilidades en window
// Cargar en el HTML (menú) con: <script type="module" src="./firebase-init.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Exponer funciones en window para que app.jsx (Babel) pueda usarlas sin imports
window.initializeApp = initializeApp;
window.getAuth = getAuth;
window.signInAnonymously = signInAnonymously;
window.signInWithCustomToken = signInWithCustomToken;
window.getFirestore = getFirestore;
window.doc = doc;
window.onSnapshot = onSnapshot;
window.updateDoc = updateDoc;
window.setDoc = setDoc;
window.getDoc = getDoc;
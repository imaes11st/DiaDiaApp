// scripts/seedFirebase.js
// Script para poblar datos de ejemplo en Firebase
// Ejecutar con: node scripts/seedFirebase.js

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  // Tu configuración de Firebase aquí
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedData() {
  try {
    console.log("🌱 Poblando datos de ejemplo...");

    // Crear usuario de prueba
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "test@example.com",
      "password123"
    );

    const userId = userCredential.user.uid;
    console.log("✅ Usuario creado:", userId);

    // Crear hábitos de ejemplo
    const habits = [
      {
        title: "Hacer ejercicio",
        priority: "high",
        createdAt: new Date().toISOString(),
        lastDoneAt: new Date().toISOString(),
        streak: 3,
        userId,
      },
      {
        title: "Leer 30 minutos",
        priority: "mid",
        createdAt: new Date().toISOString(),
        lastDoneAt: null,
        streak: 0,
        userId,
      },
      {
        title: "Meditar",
        priority: "low",
        createdAt: new Date().toISOString(),
        lastDoneAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        streak: 7,
        userId,
      },
    ];

    for (const habit of habits) {
      await addDoc(collection(db, "habits"), habit);
    }

    // Crear perfil
    await addDoc(collection(db, "profiles"), {
      name: "Usuario de Prueba",
      role: "Desarrollador",
      avatarUri: null,
    });

    console.log("✅ Datos poblados exitosamente!");
    console.log("📧 Email: test@example.com");
    console.log("🔑 Password: password123");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

seedData();
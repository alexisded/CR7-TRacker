import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

// 1. Configuración de tu Firebase (Copia esto de Firebase Console)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function CR7Counter() {
  const [stats, setStats] = useState({ career_goals: 0, road_to_1000: 0 });

  useEffect(() => {
    // 2. ESCUCHA EN TIEMPO REAL
    // Cada vez que el Sync Engine actualice Firestore, tu web cambiará sola
    const unsub = onSnapshot(doc(db, "stats", "cr7_totals"), (doc) => {
      setStats(doc.data());
    });

    return () => unsub();
  }, []);

  return (
    <div className="counter-container">
      <h1>{stats.career_goals}</h1>
      <p>Faltan {stats.road_to_1000} para el objetivo</p>
    </div>
  );
}

import { getApps, initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCkP_8jBoQ_u1wLwg_CPQqaBQz9wRQFBRo",
  authDomain: "montis-892b4.firebaseapp.com",
  databaseURL: "https://montis-892b4-default-rtdb.firebaseio.com",
  projectId: "montis-892b4",
  storageBucket: "montis-892b4.appspot.com", // Corrigido!
  messagingSenderId: "1069209690153",
  appId: "1:1069209690153:web:9375965e53656b482c7c38",
  measurementId: "G-ZT14HFMKNZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

export { app, database };

// Função para verificar o status de autenticação do Firebase
export function checkFirebaseAuthStatus() {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log('Firebase Auth Status:', {
    isAuthenticated: !!user,
    user: user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    } : null
  });
  return user;
}

// Salva o registro diário do usuário para uma data específica
export async function saveDailyTracking(date: string, data: any) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuário não autenticado');
  const dbRef = ref(database, `users/${user.uid}/dailyTracking/${date}`);
  await set(dbRef, { ...data, updatedAt: new Date().toISOString() });
}

// Busca o registro diário do usuário para uma data específica
export async function getDailyTracking(date: string) {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuário não autenticado');
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `users/${user.uid}/dailyTracking/${date}`));
  return snapshot.exists() ? snapshot.val() : null;
}

import { initializeApp } from '@firebase/app';
import { getDatabase } from '@firebase/database';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: 'montis-892b4.firebaseapp.com',
  databaseURL: 'https://montis-892b4-default-rtdb.firebaseio.com/',
  projectId: 'montis-892b4',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: 'AIzaSyBy02gvyZNH507q7OyxhcgMj0jH7-TAI-8',
  authDomain: 'crud-app-7d9bf.firebaseapp.com',
  projectId: 'crud-app-7d9bf',
  storageBucket: 'crud-app-7d9bf.appspot.com',
  messagingSenderId: '161397439096',
  appId: '1:161397439096:web:8cae3516aeb417f5a78b8d',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

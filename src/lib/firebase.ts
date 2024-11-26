import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBJGNCuSAW_Hznz0IpZqe0liNun3xuEDHU",
    authDomain: "lantaw-baka-online.firebaseapp.com",
    databaseURL: "https://lantaw-baka-online-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lantaw-baka-online",
    storageBucket: "lantaw-baka-online.appspot.com",
    messagingSenderId: "596705747283",
    appId: "1:596705747283:web:81f9aba10eb0453bed01a6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

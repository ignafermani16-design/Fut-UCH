import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDcYyy7nQYBr5I4SUqrSC5F6HAYyPyRuZs",
  authDomain: "fut-uch.firebaseapp.com",
  projectId: "fut-uch",
  storageBucket: "fut-uch.firebasestorage.app",
  messagingSenderId: "746925903342",
  appId: "1:746925903342:web:4cd1bee8cacd6b075752ff"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
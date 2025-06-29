// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
    getFirestore,
    connectFirestoreEmulator,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    memoryLocalCache
} from 'firebase/firestore';

const firebaseConfig = {
    // Your Firebase config object
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with modern persistence API
export const db = (() => {
    if (typeof window === 'undefined') {
        // Server-side: use default Firestore
        return getFirestore(app);
    }

    // Client-side: initialize with persistence
    try {
        return initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (error) {
        console.warn('Failed to enable persistent cache, using memory cache:', error);
        try {
            return initializeFirestore(app, {
                localCache: memoryLocalCache()
            });
        } catch (fallbackError) {
            console.warn('Failed to initialize with memory cache, using default:', fallbackError);
            return getFirestore(app);
        }
    }
})();

// Connect to emulators in development
if (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {

    console.log('Detected localhost environment, connecting to emulators...');

    // Check if emulators are already connected
    let shouldConnectAuth = true;
    let shouldConnectFirestore = true;

    try {
        // Try to detect if already connected by checking the auth config
        if ((auth as any)._config?.emulator) {
            shouldConnectAuth = false;
            console.log('Auth emulator already connected');
        }
    } catch (e) {
        // Continue with connection attempt
    }

    try {
        // Try to detect if already connected by checking the firestore config
        if ((db as any)._delegate?._databaseId?.projectId?.includes('demo-') ||
            (db as any)._settings?.host?.includes('127.0.0.1')) {
            shouldConnectFirestore = false;
            console.log('Firestore emulator already connected');
        }
    } catch (e) {
        // Continue with connection attempt
    }

    if (shouldConnectAuth) {
        try {
            connectAuthEmulator(auth, 'http://127.0.0.1:9099');
            console.log('✅ Connected to Auth emulator on 127.0.0.1:9099');
        } catch (error) {
            console.log('Auth emulator connection failed or already connected:', error);
        }
    }

    if (shouldConnectFirestore) {
        try {
            connectFirestoreEmulator(db, '127.0.0.1', 8080);
            console.log('✅ Connected to Firestore emulator on 127.0.0.1:8080');
        } catch (error) {
            console.log('Firestore emulator connection failed or already connected:', error);
        }
    }
}

export default app;
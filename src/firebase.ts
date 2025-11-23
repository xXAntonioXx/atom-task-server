import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
        process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
        process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        admin.initializeApp();
    } else {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID || '',
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
                privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
                    /\\n/g,
                    '\n',
                ),
            }),
        });
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;

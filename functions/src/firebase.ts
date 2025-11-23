import admin from 'firebase-admin';

if (process.env.FUNCTIONS_EMULATOR) {
    const serviceAccount = require('../service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    admin.initializeApp(); // cloud functions environment
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;

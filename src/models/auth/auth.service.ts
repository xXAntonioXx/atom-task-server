import { auth } from '../../firebase.js';

export const loginService = async (email: string) => {
    try {
        let user = await validateUserExists(email);
        if (!user) {
            user = await auth.createUser({ email: email });
        }
        const customToken = await auth.createCustomToken(user.uid);
        return customToken;
    } catch (error) {
        console.error('service:loginUser:Error logging in user:', error);
        throw error;
    }
};

const validateUserExists = async (email: string) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    } catch (error) {
        return null;
    }
};

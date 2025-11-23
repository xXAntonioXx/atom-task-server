import { auth } from '../../firebase.js';

export const loginService = async (email: string) => {
    try {
        let user = await validateUserExists(email);
        if (!user) {
            //user = await auth.createUser({ email: email });
            return {
                token: '',
                userExists: false,
            };
        }
        const customToken = await auth.createCustomToken(user.uid);
        return {
            token: customToken,
            userExists: true,
        };
    } catch (error) {
        console.error('service:loginUser:Error logging in user:', error);
        throw error;
    }
};

export const signupService = async (email: string) => {
    try {
        const user = await auth.createUser({ email: email });
        const customToken = await auth.createCustomToken(user.uid);
        return {
            token: customToken,
            userExists: true,
        };
    } catch (error) {
        console.error('service:signupUser:Error signing up user:', error);
        throw error;
    }
};

const validateUserExists = async (email: string) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        console.error(
            'service:validateUserExists:Error validating user existence:',
            error,
        );
        throw error;
    }
};

import * as AuthService from './auth.service';
import { auth } from '../../../firebase';

jest.mock('../../../firebase');
auth.createCustomToken = jest.fn().mockResolvedValue('customToken');
auth.createUser = jest
    .fn()
    .mockImplementation(async ({ email }: { email: string }) => {
        return { uid: '12345', email: email } as any;
    });

jest.spyOn(AuthService, 'validateUserExists').mockImplementation(
    async (email: string) => {
        if (email === 'test') {
            return { uid: '12345', email: 'test' } as any;
        } else {
            return null;
        }
    },
);

describe('auth.service layer', () => {
    test('loginService returns token and userExists true when user exists', async () => {
        expect(AuthService.loginService('test')).resolves.toEqual({
            token: 'customToken',
            userExists: true,
        });
    });
    test('loginService returns empty token and userExists false when user does not exist', async () => {
        expect(AuthService.loginService('nonexistent')).resolves.toEqual({
            token: '',
            userExists: false,
        });
    });
    test('signupService creates user and returns token and userExists true', async () => {
        expect(AuthService.signupService('newuser')).resolves.toEqual({
            token: 'customToken',
            userExists: true,
        });
    });
});

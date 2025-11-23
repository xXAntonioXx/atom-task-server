import type { Request, Response } from 'express';
import { loginService, signupService } from './auth.service.js';

export const login = async (req: Request, res: Response) => {
    try {
        const newUser = await loginService(req.body.email);
        res.status(200).json(newUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const newUser = await signupService(req.body.email);
        res.status(200).json(newUser);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

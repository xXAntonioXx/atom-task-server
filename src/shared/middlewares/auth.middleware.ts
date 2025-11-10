import type { Request, Response, NextFunction } from 'express';
import { auth } from '../../firebase.js';

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = await auth.verifyIdToken(token);
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.error('middleware:verifyToken:Error verifying token:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

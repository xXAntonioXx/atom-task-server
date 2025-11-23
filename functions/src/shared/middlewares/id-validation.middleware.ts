import type { NextFunction, Request, Response } from 'express';

export const validateRequestIdExists = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'ID param is required' });
    }
    next();
};

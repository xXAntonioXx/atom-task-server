import type { Request, Response, NextFunction } from 'express';

export const bodyValidation =
    (schema: any) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            res.status(400).json({ error: error.issues });
        }
    };

import type { Request } from 'express';

export const validateRequestIdExists = (req: Request) => {
    if (!req.params.id) {
        throw new Error('Task ID is required');
    }
};

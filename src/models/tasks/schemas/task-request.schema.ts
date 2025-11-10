import * as z from 'zod';

export const taskRequestSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(5).max(500),
    createdAt: z.string(),
    completed: z.boolean().default(false),
});

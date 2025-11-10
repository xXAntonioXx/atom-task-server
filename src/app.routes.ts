import type { Express } from 'express';
import tasksRoutes from './models/tasks/tasks.routes.js';
import authRoutes from './models/auth/auth.routes.js';

const setRoutes = (app: Express) => {
    app.use('/api/tasks', tasksRoutes);
    app.use('/api/auth', authRoutes);
};

export default setRoutes;

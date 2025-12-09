import type { Express } from 'express';
import tasksRoutes from './models/tasks/tasks.routes';
import authRoutes from './models/auth/auth.routes';

const setRoutes = (app: Express) => {
    app.use('/tasks', tasksRoutes);
    app.use('/auth', authRoutes);
};

export default setRoutes;

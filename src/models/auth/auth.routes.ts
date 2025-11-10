import { Router } from 'express';
import { login } from './auth.controller.js';
import { loginRequestSchema } from './schemas/login-request.schema.js';
import { bodyValidation } from '../../shared/middlewares/body-validation.middleware.js';

const router = Router();

router.post('/login', bodyValidation(loginRequestSchema), login);

export default router;

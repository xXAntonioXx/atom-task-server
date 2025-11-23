import { Router } from 'express';
import { login, signup } from './auth.controller.js';
import { loginRequestSchema } from './schemas/login-request.schema.js';
import { bodyValidation } from '../../shared/middlewares/body-validation.middleware.js';

const router = Router();

router.post('/login', bodyValidation(loginRequestSchema), login);
router.post('/signup', bodyValidation(loginRequestSchema), signup);

export default router;

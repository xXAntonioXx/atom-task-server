import { Router } from 'express';
import { get, getAll, create, update, remove } from './tasks.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { bodyValidation } from '../../shared/middlewares/body-validation.middleware.js';
import { taskRequestSchema } from './schemas/task-request.schema.js';
import { validateRequestIdExists } from '../../shared/middlewares/id-validation.middleware.js';

const router = Router();

router.use(verifyToken);
router.get('/', getAll);
router.get('/:id', validateRequestIdExists, get);
router.post('/', bodyValidation(taskRequestSchema), create);
router.put('/:id', validateRequestIdExists, update);
router.delete('/:id', validateRequestIdExists, remove);

export default router;

import { Router } from 'express';
import userRoutes from './userRoutes.ts';
import { docsRoutes } from './docsRoutes.ts'; // Добавили фигурные скобки

const router = Router();

router.use('/users', userRoutes);
router.use('/docs', docsRoutes);

export default router;

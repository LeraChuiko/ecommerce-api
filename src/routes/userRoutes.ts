import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.ts';
import { validate } from '../middleware/validate.ts';
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from '../schemas/userSchema.ts';

const router = Router();

// 1. GET /users — Получить всех
router.get('/', getAllUsers);

// 2. GET /users/:id — Получить одного по ID
router.get('/:id', validate(userIdParamSchema), getUserById);

// 3. POST /users — Создать нового
router.post('/', validate(createUserSchema), createUser);

// 4. PUT /users/:id — Обновить по ID
router.put('/:id', validate(updateUserSchema), updateUser);

// 5. DELETE /users/:id — Удалить по ID
router.delete('/:id', validate(userIdParamSchema), deleteUser);

export default router;

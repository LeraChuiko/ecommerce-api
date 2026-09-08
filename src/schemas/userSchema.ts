import { z } from 'zod';

// 1. Схема для проверки ID в URL
export const userIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID должен быть строкой' })
      .min(1, 'ID пользователя обязателен'),
  }),
});

// 2. Схема для создания пользователя (POST /users)
export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Имя обязательно' })
      .min(2, 'Имя должно содержать минимум 2 символа'),
    email: z
      .string({ message: 'Email обязателен' })
      .email('Некорректный формат email'),
    password: z
      .string({ message: 'Пароль обязателен' })
      .min(6, 'Пароль должен содержать минимум 6 символов'),
  }),
});

// 3. Схема для обновления пользователя (PUT /users/:id)
export const updateUserSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID должен быть строкой' })
      .min(1, 'ID пользователя обязателен'),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, 'Имя должно содержать минимум 2 символа')
      .optional(),
    email: z.string().email('Некорректный формат email').optional(),
    password: z
      .string()
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .optional(),
  }),
});

import type { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.ts';

// 1. GET /users — Получить всех пользователей
export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// 2. GET /users/:id — Получить одного пользователя по ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 3. POST /users — Создать нового пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Проверка уникальности email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
      return;
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// 4. PUT /users/:id — Обновить данные пользователя
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// 5. DELETE /users/:id — Удалить пользователя
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    next(error);
  }
};

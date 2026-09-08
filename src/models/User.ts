import { Schema, model, type Document } from 'mongoose';

// Типы остаются строгими! Никаких лишних '?'
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        // Отделяем _id, __v и password, а остальные поля собираем в userObject
        const { _id, __v, password, ...userObject } = ret;
        return {
          id: _id.toString(),
          ...userObject,
        };
      },
    },
  },
);

export const User = model<IUser>('User', userSchema);

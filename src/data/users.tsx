// src/data/users.tsx
import { getDB, hash } from '../data/db';
import { RegisterData } from '../types/User';

export type UserDB = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isGuest: boolean;
};

// Регистрация нового пользователя
const registerUser = async (data: RegisterData): Promise<boolean> => {
  const db = await getDB();

  // Проверяем, есть ли уже такой email
  const existing = await db.getFirstAsync(
    'SELECT id FROM users WHERE email = ?;',
    [data.email]
  );

  if (existing) return false;

  await db.runAsync(
    'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?);',
    [
      data.name,
      data.email,
      hash(data.password),
      `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`
    ]
  );

  return true;
};

// Логин пользователя
export const loginUser = async (email: string, password: string): Promise<UserDB | null> => {
  const db = await getDB();
  const hashed = hash(password);

  const row = await db.getFirstAsync(
    'SELECT id, name, email, avatar FROM users WHERE email = ? AND password = ?;',
    [email, hashed]
  );

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}`,
    isGuest: false
  };
};

export default registerUser;

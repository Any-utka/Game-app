// src/services/auth.tsx
import registerUserFromFile from '../data/users';
import { User } from '../types/User';

// регистрация нового пользователя через сервис
export async function registerUser(user: Omit<User, 'avatar'> & { password: string }): Promise<boolean> {
  const success = await registerUserFromFile(user);
  return success;
}

// логин пользователя — временная имитация
// так как в users.ts хранится только registerUser, логин нужно делать вручную
const users: { name: string; email: string; password: string }[] = []; // имитация хранилища для логина

export async function loginUser(email: string, password: string): Promise<User | null> {
  // ищем пользователя в памяти
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) return null;

  return {
    name: found.name,
    email: found.email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name)}`,
    isGuest: false,
  };
}

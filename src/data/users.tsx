// src/data/users.tsx
import { RegisterData } from '../types/User';

type StoredUser = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

// временное хранилище пользователей в памяти
const users: StoredUser[] = [
  {
    name: 'DemoUser',
    email: 'demo@gameflix.com',
    password: '123456',
    avatar: 'https://i.ibb.co/XXY/demo-avatar.png',
  },
];

// функция регистрации нового пользователя
const registerUser = async (data: RegisterData): Promise<boolean> => {
  const exists = users.some(user => user.email === data.email);
  if (exists) return false; // уже есть такой email

  users.push({
    ...data,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
  });
  return true;
};

// функция логина
export const loginUser = async (email: string, password: string): Promise<StoredUser | null> => {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

export default registerUser;

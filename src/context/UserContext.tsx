// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 🔹 Тип пользователя для контекста
export type User = {
  name: string;
  email: string;
  isGuest?: boolean;
  avatar?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loginGuest: () => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loginGuest: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const loginGuest = () => {
    setUser({
      name: 'Гость',
      email: '',
      isGuest: true,
      avatar: 'https://ui-avatars.com/api/?name=Guest',
    });
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, loginGuest, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

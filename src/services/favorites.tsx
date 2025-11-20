// src/services/favorites.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const FAVORITES_KEY = 'favorites_games_';

// получить избранное пользователя
export async function getFavorites(user: User | null): Promise<number[]> {
  // у гостя ничего не храним
  if (!user || user.isGuest) return [];

  const data = await AsyncStorage.getItem(FAVORITES_KEY + user.email);
  return data ? JSON.parse(data) : [];
}

// добавить
export async function addFavorite(id: number, user: User | null) {
  if (!user || user.isGuest) return;

  const favorites = await getFavorites(user);
  if (!favorites.includes(id)) {
    favorites.push(id);
    await AsyncStorage.setItem(FAVORITES_KEY + user.email, JSON.stringify(favorites));
  }
}

// удалить
export async function removeFavorite(id: number, user: User | null) {
  if (!user || user.isGuest) return;

  let favorites = await getFavorites(user);
  favorites = favorites.filter(favId => favId !== id);
  await AsyncStorage.setItem(FAVORITES_KEY + user.email, JSON.stringify(favorites));
}

// переключить
export async function toggleFavorite(id: number, user: User | null) {
  if (!user || user.isGuest) return;

  const favorites = await getFavorites(user);
  if (favorites.includes(id)) {
    await removeFavorite(id, user);
  } else {
    await addFavorite(id, user);
  }
}

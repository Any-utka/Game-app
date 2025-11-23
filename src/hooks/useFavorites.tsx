// src/hooks/useFavorites.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from './useGames';
import { User } from '../context/UserContext';

const FAVORITES_KEY_PREFIX = 'favorites_';

export const useFavorites = (user: User | null) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const storageKey = user && !user.isGuest && user.email ? `${FAVORITES_KEY_PREFIX}${user.email}` : null;

  // Подгрузка избранного при изменении пользователя
  useEffect(() => {
    if (!user || user.isGuest || !storageKey) {
      setFavoriteIds([]);
      return;
    }

    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        setFavoriteIds(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavoriteIds([]);
      }
    };

    loadFavorites();
  }, [user, storageKey]);

  // Сохранение изменений в AsyncStorage
  const saveFavorites = useCallback(
    async (ids: number[]) => {
      if (!storageKey) return;
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(ids));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    },
    [storageKey]
  );

  const addFavorite = useCallback(
    (id: number) => {
      if (!user || user.isGuest) return;
      setFavoriteIds(prev => {
        if (prev.includes(id)) return prev;
        const updated = [...prev, id];
        saveFavorites(updated);
        return updated;
      });
    },
    [user, saveFavorites]
  );

  const removeFavorite = useCallback(
    (id: number) => {
      if (!user || user.isGuest) return;
      setFavoriteIds(prev => {
        const updated = prev.filter(favId => favId !== id);
        saveFavorites(updated);
        return updated;
      });
    },
    [user, saveFavorites]
  );

  const isFavorite = useCallback(
    (id: number) => {
      return favoriteIds.includes(id);
    },
    [favoriteIds]
  );

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};

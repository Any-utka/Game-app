// src/hooks/useFavorites.tsx
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from './infoGames';
import { User } from '../types/User';

const FAVORITES_KEY_PREFIX = 'favorites_';

export const useFavorites = (user: User | null) => {
  const [favorites, setFavorites] = useState<Game[]>([]);

  const storageKey = user && !user.isGuest && user.email ? `${FAVORITES_KEY_PREFIX}${user.email}` : null;

  useEffect(() => {
    if (!storageKey) return;

    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, [storageKey]);

  const saveFavorites = useCallback(async (newFavorites: Game[]) => {
    if (!storageKey) return;
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [storageKey]);

  const addFavorite = useCallback((game: Game) => {
    if (!storageKey) return; // гости не могут добавлять
    setFavorites(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (exists) return prev; // не добавляем дубликаты
      const newFavorites = [...prev, game];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites, storageKey]);

  const removeFavorite = useCallback((gameId: number) => {
    if (!storageKey) return; // гости не могут удалять
    setFavorites(prev => {
      const newFavorites = prev.filter(g => g.id !== gameId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites, storageKey]);

  const isFavorite = useCallback((gameId: number) => {
    return favorites.some(g => g.id === gameId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};

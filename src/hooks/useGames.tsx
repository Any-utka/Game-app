// src/hooks/useGames.tsx
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getDB } from '../data/db';
import { User } from '../types/User';

export type Game = {
  id: number;
  title: string;
  overview: string;
  genres: string[];
  duration: string;
  year: number;
  poster: string;
};

export function useGames(currentUser: User | null, dbReady: boolean) {
  const [games, setGames] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbReady) return;

    const loadGames = async () => {
      try {
        const db = await getDB();
        const gamesRes = await db.getAllAsync('SELECT * FROM games;');
        const data: Game[] = gamesRes.map((g: any) => ({
          id: g.id,
          title: g.title,
          overview: g.overview,
          genres: g.genres ? JSON.parse(g.genres) : [],
          duration: g.duration,
          year: g.year,
          poster: g.poster,
        }));
        setGames(data);

        if (currentUser && !currentUser.isGuest) {
          const userRow = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [currentUser.email]);
          if (userRow) {
            const favRes = await db.getAllAsync('SELECT gameId FROM favorites WHERE userId = ?;', [userRow.id]);
            setFavorites(favRes.map((f: any) => f.gameId));
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Error loading games/favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [currentUser, dbReady]);

  const toggleFav = async (gameId: number) => {
    if (!currentUser) {
      Alert.alert('Ошибка', 'Для добавления игры в избранное нужно войти в профиль');
      return;
    }

    try {
      const db = await getDB();
      const userRow = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [currentUser.email]);
      if (!userRow) return;

      const fav = await db.getFirstAsync(
        'SELECT * FROM favorites WHERE userId = ? AND gameId = ?;',
        [userRow.id, gameId]
      );

      if (fav) {
        await db.runAsync('DELETE FROM favorites WHERE userId = ? AND gameId = ?;', [userRow.id, gameId]);
        setFavorites(prev => prev.filter(f => f !== gameId));
      } else {
        await db.runAsync('INSERT INTO favorites (userId, gameId) VALUES (?, ?);', [userRow.id, gameId]);
        setFavorites(prev => [...prev, gameId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return { games, favorites, toggleFav, loading };
}

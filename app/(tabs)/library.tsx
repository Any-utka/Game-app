// app/(tabs)/library.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useGames } from '../../src/hooks/infoGames';
import { useUser } from '../../src/context/UserContext';

export default function LibraryScreen() {
  const { user } = useUser(); // Получаем реального пользователя
  const { games, favorites: globalFavorites, toggleFav, loading } = useGames(user); // Передаем пользователя

  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(globalFavorites);
  }, [globalFavorites]);

  const favoriteGames = games.filter(game => favorites.includes(game.id));

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Пожалуйста, войдите в аккаунт</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

  const handleToggleFav = (id: number) => {
    toggleFav(id); // Сохраняет в AsyncStorage и обновляет состояние
  };

  return (
    <View style={styles.container}>
      {favoriteGames.length === 0 ? (
        <Text style={styles.emptyText}>Нет понравившихся игр</Text>
      ) : (
        <FlatList
          data={favoriteGames}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.genres}>{item.genres.join(', ')}</Text>
                <TouchableOpacity onPress={() => handleToggleFav(item.id)}>
                  <Text style={styles.remove}>Удалить 🔥</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f0f1f' },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#111122',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00fff7',
    shadowColor: '#00fff7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  poster: { width: 80, height: 120, borderRadius: 8 },
  title: { color: '#00fff7', fontSize: 18, fontWeight: 'bold', textShadowColor: '#00fff7', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  genres: { color: '#66fff7', marginTop: 4, fontSize: 14 },
  remove: { color: '#ff0055', marginTop: 8, fontWeight: 'bold', textShadowColor: '#ff0055', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 4 },
  emptyText: { color: '#66fff7', textAlign: 'center', marginTop: 32, fontSize: 16 },
});

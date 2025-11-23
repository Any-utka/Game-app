// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGames } from '../../src/hooks/useGames';
import GameCard from '../../src/components/GameList';
import { useUser } from '../../src/context/UserContext';
import { setupDatabase } from '../../src/data/db';
import { theme } from '../../src/theme/theme';

export default function CatalogScreen() {
  const { user } = useUser();
  const [dbReady, setDbReady] = useState(false);

  // Инициализация базы
  useEffect(() => {
    const initDB = async () => {
      await setupDatabase();
      setDbReady(true);
    };
    initDB();
  }, []);

  const { games, favorites, toggleFav, loading } = useGames(user, dbReady);

  const handleToggleFav = (id: number) => {
    if (!user) {
      Alert.alert('Ошибка', 'Для добавления игры в избранное нужно войти в профиль');
      return;
    }
    toggleFav(id);
  };

  // Пользователь не вошёл
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.notice}>
          Пожалуйста, войдите в аккаунт или используйте гостевой доступ, чтобы просматривать игры
        </Text>
      </View>
    );
  }

  // База не готова или идёт загрузка
  if (!dbReady || loading) {
    return <Text style={styles.loading}>Загрузка...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFav={() => handleToggleFav(item.id)}
            disableFav={user.isGuest}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 15 },
  loading: { color: theme.colors.muted, textAlign: 'center', marginTop: 32 },
  notice: { color: theme.colors.muted, textAlign: 'center', marginTop: 50, fontSize: 16 },
  listContent: { paddingBottom: 100 },
});

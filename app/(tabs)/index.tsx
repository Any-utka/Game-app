// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGames } from '../../src/hooks/infoGames';
import GameCard from '../../src/components/GameList';
import { useUser } from '../../src/context/UserContext';

export default function CatalogScreen() {
  const { user } = useUser();
  const { games, favorites, toggleFav, loading } = useGames(user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.notice}>
          Пожалуйста, войдите в аккаунт или используйте гостевой доступ
        </Text>
      </View>
    );
  }

  if (loading) {
    return <Text style={styles.loading}>Загрузка...</Text>;
  }

  const handleToggleFav = (id: number) => {
    if (!user || user.isGuest) return;
    toggleFav(id);
  };

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
  container: { flex: 1, backgroundColor: '#0f0f1f', paddingHorizontal: 15 },
  loading: { color: '#66fff7', textAlign: 'center', marginTop: 32, fontSize: 16 },
  notice: { color: '#fff', textAlign: 'center', marginTop: 50, fontSize: 16 },
  listContent: { paddingBottom: 100 },
});

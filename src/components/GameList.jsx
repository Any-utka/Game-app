// src/components/GameList.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function GameCard({ game, isFavorite: initialFavorite, onToggleFav, disableFav = false, neonStyle = true }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => setIsFavorite(initialFavorite), [initialFavorite]);

  const handleOpenLink = async () => {
    if (game.link && (await Linking.canOpenURL(game.link))) {
      await Linking.openURL(game.link);
    }
  };

  const handleToggleFav = () => {
    if (disableFav) return; // гость не может добавлять
    setIsFavorite(prev => !prev);
    onToggleFav();
  };

  const toggleOverview = () => setExpanded(prev => !prev);

  const cardStyle = [
    styles.card,
    neonStyle && {
      borderColor: '#00fff7',
      shadowColor: '#00fff7',
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    disableFav && { opacity: 0.5 }, // полупрозрачная карточка для гостей
  ];

  return (
    <View style={cardStyle}>
      <TouchableOpacity onPress={handleOpenLink}>
        <Image source={{ uri: game.poster }} style={styles.poster} />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.meta}>{game.year} • {game.duration}</Text>
        <Text style={styles.genres}>{game.genres.join(', ')}</Text>

        <Text style={styles.overview} numberOfLines={expanded ? undefined : 3}>
          {game.overview}
        </Text>

        <TouchableOpacity onPress={toggleOverview}>
          <Text style={styles.showMore}>
            {expanded ? 'Скрыть описание 🔽' : 'Развернуть описание 🔼'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isFavorite && styles.buttonActive]}
          onPress={handleToggleFav}
          disabled={disableFav} // для гостя не кликабельна
        >
          <Text style={styles.buttonText}>
            {isFavorite ? '🔥 В избранном' : '⚡ Добавить в избранное'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#111122',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#222233',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  poster: { width: 100, height: 180, borderRadius: 8, marginRight: 12, backgroundColor: '#333' },
  info: { flex: 1 },
  title: {
    color: '#00fff7',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textShadowColor: '#00fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  meta: { color: '#66fff7', fontSize: 13, marginBottom: 4 },
  genres: { color: '#ff55aa', fontSize: 13, marginBottom: 6, fontWeight: '500' },
  overview: { color: '#ddd', fontSize: 12, lineHeight: 16 },
  showMore: { color: '#919090b4', fontWeight: 'bold', marginTop: 4, marginBottom: 8, fontSize: 12 },
  button: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#222233',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#00fff7',
  },
  buttonActive: {
    backgroundColor: '#330011',
    borderColor: '#ff0055',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: '#00fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});

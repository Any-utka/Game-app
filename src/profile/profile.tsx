// src/profile/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../src/context/UserContext';

export default function ProfileScreen() {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
  };

  const isGuest = user?.isGuest ?? false;
  const avatar = user?.avatar || 'https://i.ibb.co/2s6N1Wx/gamer-avatar.png'; // геймерская аватарка по умолчанию

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: user ? '#0b0b1f' : '#111122' },
      ]}
    >
      {!user && <Text style={styles.topMessage}>Войдите в профиль</Text>}

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        {user && (
          <View style={styles.profileCard}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>
              {isGuest ? 'Вы вошли с гостевого аккаунта' : user.email}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00fff7',
    textShadowColor: '#00fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#111122',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00fff7',
    shadowColor: '#00fff7',
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#ff00ff',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00fff7',
    marginBottom: 6,
    textShadowColor: '#00fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  email: {
    fontSize: 16,
    color: '#66fff7',
    marginBottom: 20,
    textShadowColor: '#66fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#330033',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});

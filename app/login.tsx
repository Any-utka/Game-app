// app/login.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { useUser, User } from '../src/context/UserContext';
import { useRouter } from 'expo-router';
import { loginUser } from '../src/data/users';

export default function LoginScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('(tabs)');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const foundUser = await loginUser(email, password);

    if (foundUser) {
      const loggedUser: User = {
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.name)}`,
        isGuest: false,
      };
      setUser(loggedUser);
      Alert.alert('Успех', `Добро пожаловать, ${loggedUser.name}!`);
    } else {
      Alert.alert('Ошибка', 'Неверный email или пароль');
    }
  };

  const handleGuest = () => {
    const guestUser: User = {
      name: 'Гость',
      email: 'guest@guest.com',
      avatar: 'https://ui-avatars.com/api/?name=Guest',
      isGuest: true,
    };
    setUser(guestUser);
  };

  const goToRegister = () => router.push('/register');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GameFlix Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.secondaryText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor={theme.colors.secondaryText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonGuest} onPress={handleGuest}>
        <Text style={styles.buttonText}>Войти как гость 🎮</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: theme.colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  button: {
    backgroundColor: theme.colors.card,
    padding: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  buttonGuest: {
    backgroundColor: theme.colors.accent,
    padding: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.secondaryText,
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: theme.colors.secondaryText,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});

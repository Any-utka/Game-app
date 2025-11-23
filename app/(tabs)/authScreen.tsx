import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { useUser, User } from '../../src/context/UserContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../../src/data/users';
import { theme } from '../../src/theme/theme';

export default function AuthScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const eyeScale = useState(new Animated.Value(1))[0];

  useEffect(() => {
    if (user) {
      router.replace('/'); // редирект после логина на главную вкладку
    }
  }, [user]);

  const animateEye = () => {
    Animated.sequence([
      Animated.timing(eyeScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const togglePassword = () => {
    animateEye();
    setShowPassword(prev => !prev);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }

    const found = await loginUser(email, password);

    if (!found) {
      Alert.alert('Ошибка', 'Неверный email или пароль');
      return;
    }

    const loggedUser: User = {
      name: found.name,
      email: found.email,
      avatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(found.name)}`,
      isGuest: false,
    };

    setUser(loggedUser);
    Alert.alert('Успех', `Добро пожаловать, ${loggedUser.name}!`);
    router.replace('/');
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      name: 'Гость',
      email: 'guest@guest.com',
      avatar: 'https://ui-avatars.com/api/?name=Guest',
      isGuest: true,
    };
    setUser(guestUser);
    router.replace('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GameFlix</Text>
      <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Animated.View style={{ position: 'absolute', right: 12, transform: [{ scale: eyeScale }] }}>
          <TouchableOpacity onPress={togglePassword}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#ff00ff" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonGuest} onPress={handleGuestLogin}>
        <Text style={styles.buttonText}>Войти как гость 🎮</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.register} onPress={handleRegister}>
        <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00fff7',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#00fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#66fff7',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: '#66fff7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  input: {
    backgroundColor: '#111122',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00fff7',
  },
  button: {
    backgroundColor: '#222233',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00fff7',
    alignItems: 'center',
  },
  buttonGuest: {
    backgroundColor: '#330011',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff0055',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  register: {
    alignItems: 'center',
  },
  registerText: {
    color: '#66fff7',
    textDecorationLine: 'underline',
  },
});

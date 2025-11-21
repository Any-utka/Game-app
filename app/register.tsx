// app/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import registerUser from '../src/data/users';
import { useRouter } from 'expo-router';
import { useUser, User } from '../src/context/UserContext';
import { RegisterData } from '../src/types/User';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const eyeScale = useState(new Animated.Value(1))[0];

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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const data: RegisterData = { name, email, password };
    const success = await registerUser(data);

    if (success) {
      const newUser: User = {
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        isGuest: false,
      };
      setUser(newUser);

      Alert.alert('Успех', 'Регистрация прошла успешно!');
      router.replace('/authScreen');
    } else {
      Alert.alert('Ошибка', 'Пользователь с таким email уже существует');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Создай свой аккаунт</Text>
      <Text style={styles.subtitle}>Присоединяйся к GameFlix 🎮</Text>

      <TextInput
        style={styles.input}
        placeholder="Имя"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Animated.View style={styles.eyeIcon}>
          <TouchableOpacity onPress={togglePassword}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#ff55aa"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/authScreen')}>
        <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f1f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff55aa',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    width: '100%',
    backgroundColor: '#111122',
    color: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ff55aa',
    fontWeight: '500',
    fontSize: 14,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  button: {
    backgroundColor: '#ff0055',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ff55aa',
    shadowColor: '#ff55aa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  link: {
    color: '#66fff7',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});

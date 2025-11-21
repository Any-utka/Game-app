// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { UserProvider } from '../../src/context/UserContext';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f0f1f', // темный геймерский фон
            height: 60,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: '#00fff7', // неоновый акцент
            fontWeight: 'bold',
            fontSize: 20,
            fontFamily: 'PressStart2P-Regular', // шрифт в ретро-игровом стиле (можно подключить)
            textShadowColor: '#00fff7',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 10,
          },
          headerShadowVisible: false,

          // Настройки нижних табов
          tabBarStyle: {
            backgroundColor: '#101020',
            borderTopColor: '#222',
            height: 90,
            paddingBottom: 6,
            paddingTop: 6,
            position: 'absolute',
            bottom: 0,
            elevation: 12,
            shadowColor: '#00fff7',
            shadowOpacity: 0.4,
            shadowRadius: 10,
          },
          tabBarActiveTintColor: '#00fff7', // неоновый активный
          tabBarInactiveTintColor: '#666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            textShadowColor: '#00fff7',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 4,
          },
        }}
      >
        <Tabs.Screen
          name="authScreen"
          options={{
            title: 'Авторизация',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="login-variant" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Игры',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="gamepad-circle" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Избранное',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="heart" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle-outline" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserProvider>
  );
}

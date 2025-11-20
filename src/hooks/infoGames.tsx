// src/hooks/infoGames.tsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../context/UserContext';

export type Game = {
  id: number;
  title: string;
  overview: string;
  genres: string[];
  duration: string;
  year: number;
  poster: string;
  link?: string;
};

const MOCK_GAMES: Game[] = [
  {
    id: 1,
    title: 'CS2 (Counter-Strike 2)',
    overview: 'Футуристичный соревновательный шутер, где две команды сражаются за контроль над картой и выполнение задач. Каждое решение и каждый выстрел могут решить исход раунда, а мастерство стрельбы и холодная голова — главный путь к победе.',
    genres: ['Action', 'Tactical Shooter'],
    duration: 'Hundreds of hours',
    year: 2023,
    poster: 'https://i.pinimg.com/1200x/5c/72/18/5c7218fb96e67ec06e225ca60bdb8d46.jpg', 
    },
  {
    id: 2,
    title: 'Dota 2',
    overview: 'Глобальное сражение героев в мире магии и древних сил. Две команды по пять игроков сражаются за разрушение трона противника, развивая героев, собирая мощные предметы и применяя глубокие стратегии.',
    genres: ['MOBA', 'Strategy'],
    duration: 'Thousands of hours',
    year: 2013,
    poster: 'https://i.pinimg.com/1200x/09/1d/37/091d371866ebbc9b858ac76fe6d1c2f7.jpg',
  },
  {
    id: 3,
    title: 'Trove',
    overview: 'Воксельное приключение в красочном мультивселенной, где игроки исследуют миры, строят собственные базы, прокачивают классы и отправляются за редкими сокровищами и эпическими боссами.',
    genres: ['Action RPG', 'Adventure'],
    duration: '100h+',
    year: 2015,
    poster: 'https://i.pinimg.com/736x/13/08/34/130834cae9dca627e90e64f6cb905293.jpg',
  },
  {
    id: 4,
    title: 'Rainbow Six Siege',
    overview: 'Тактический реалистичный шутер 5 на 5, где победу приносит не реакция, а планирование, командная работа и грамотное применение способностей оперативников. Каждый раунд — как маленькая спецоперация.',
    genres: ['Tactical Shooter'],
    duration: '500h+',
    year: 2015,
    poster: 'https://i.pinimg.com/736x/f8/39/e0/f839e0a15f0fde78669f15d8c3bffed9.jpg',
  },
  {
    id: 5,
    title: 'Minecraft',
    overview: 'Песочница, где всё состоит из блоков и только ваша фантазия задает предел возможному. Стройте, исследуйте, выживайте, создавайте машины и огромные миры — в одиночку или с друзьями.',
    genres: ['Sandbox', 'Survival'],
    duration: 'Infinite',
    year: 2011,
    poster: 'https://i.pinimg.com/736x/57/16/63/5716634368d924bbe7fa4340c20e257b.jpg',
  },
  {
    id: 6,
    title: 'Fortnite',
    overview: 'Королевская битва с динамичным боем и уникальной системой строительства, позволяющей создавать укрытия и башни прямо во время боя. Игра постоянно обновляется и живет за счет ярких сезонов и событий.',
    genres: ['Battle Royale', 'Action'],
    duration: '200h+',
    year: 2017,
    poster: 'https://preview.redd.it/6z6gzcn03ajz.jpg?width=640&crop=smart&auto=webp&s=c0eb61f3450c2974bc058742e52b65de50612155',
  },
  {
    id: 7,
    title: 'Warframe',
    overview: 'Кооперативный sci-fi боевик, где игроки управляют высокотехнологичными боевыми фреймами, выполняя миссии по всей Солнечной системе, прокачивая снаряжение и открывая удивительный лор вселенной.',
    genres: ['Action', 'Co-op RPG'],
    duration: 'Hundreds of hours',
    year: 2013,
    poster: 'https://i.pinimg.com/736x/a1/c3/92/a1c39241f6b2617eee6bc08a0b5b1987.jpg',
  },
  {
    id: 8,
    title: 'Roblox',
    overview: 'Огромная игровая платформа, где можно играть в тысячи разных мини-игр и миров, созданных самими игроками — от шутеров и гонок до магазинов, кафе и RPG.',
    genres: ['Platform', 'UGC'],
    duration: 'Infinite',
    year: 2006,
    poster: 'https://i.pinimg.com/736x/e9/4f/ca/e94fcab8ca7b2a05007c39b7691dc809.jpg',
  },
  {
    id: 9,
    title: 'Valorant',
    overview: 'Командный тактический шутер, в котором точная стрельба встречается с уникальными агентами, способностями и стратегиями. Каждая карта и раунд требуют четкой координации.',
    genres: ['Tactical Shooter'],
    duration: '300h+',
    year: 2020,
    poster: 'https://i.pinimg.com/1200x/d8/a7/66/d8a7664f89811ae8f3910b03ab450f65.jpg',
  },
  {
    id: 10,
    title: 'Brawlhalla',
    overview: 'Динамичный платформенный файтинг, где десятки героев сражаются на аренах, стремясь выбить соперников за пределы карты. Прост в освоении, но даёт место для мастерства и комбо.',
    genres: ['Fighting', 'Platformer'],
    duration: '100h+',
    year: 2017,
    poster: 'https://i.pinimg.com/736x/ba/de/c2/badec2423dc72cf08cc5f3f1aaa8a216.jpg',
  },
];

const FAVORITES_KEY = 'favorites_games';

export function useGames(currentUser: User | null) {
  const [games, setGames] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setGames(MOCK_GAMES);

      if (currentUser && !currentUser.isGuest) {
        const data = await AsyncStorage.getItem(FAVORITES_KEY + '_' + currentUser.email);
        setFavorites(data ? JSON.parse(data) : []);
      } else {
        setFavorites([]);
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const toggleFav = async (id: number) => {
    if (!currentUser || currentUser.isGuest) return;

    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      AsyncStorage.setItem(FAVORITES_KEY + '_' + currentUser.email, JSON.stringify(updated));
      return updated;
    });
  };

  return { games, favorites, toggleFav, loading };
}

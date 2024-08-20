'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Subscription, UserDetails } from '@/types';

type UserContextType = {
  accessToken: string | null;
  user: any | null;
  isLoading: boolean;
  subscription: Subscription | null;
  setAccessToken: (token: string | null) => void; // Add this setter
  setRefreshToken: (token: string | null) => void;
  setUser: (user: UserDetails | null) => void; // Corrected the type definition here
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // `localStorage`에서 초기 사용자 데이터를 불러옵니다.
  const [user, setUser] = useState<UserDetails | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // `user` 상태가 변경될 때마다 `localStorage`에 저장합니다.
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));

      const storedUser = localStorage.getItem('user');
      console.log('Stored user in localStorage:', storedUser);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = {
    accessToken,
    user,
    isLoading,
    subscription,
    setAccessToken,
    setRefreshToken,
    setUser,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider');
  }

  return context;
};

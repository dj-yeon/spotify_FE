'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Subscription, UserDetails } from '@/types';

type UserContextType = {
  user: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
  setUser: (user: UserDetails | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 이 부분은 클라이언트에서만 실행됩니다.
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Stored user in localStorage:', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = {
    user,
    isLoading,
    subscription,
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

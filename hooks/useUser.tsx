'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Subscription, UserDetails } from '@/types';
import Cookies from 'js-cookie';
import axiosInstance from '@/libs/axios';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 토큰을 한 번만 가져옴
  const token = Cookies.get('accessToken');

  const handleLogout = async () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    setIsLoggedIn(false);
  };

  // 비동기 데이터 로드 함수
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/auth/userdetail`, {
        headers: {
          Authorization: `Bearer ${token}`, // AccessToken 추가
        },
      });
      setUser(response.data);
    } catch (error: any) {
      console.error('Failed to fetch user details', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      } else {
        setUser(null); // 기타 오류 발생 시 사용자 상태 초기화
      }
    } finally {
      setIsLoading(false); // 로딩 상태 완료
    }
  };

  useEffect(() => {
    if (!token) {
      // console.error('Access token is missing');
      return;
    }

    if (!user && token) {
      fetchData(); // 데이터 불러오기
    }
  }, [token, user]);

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

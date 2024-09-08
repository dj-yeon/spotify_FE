'use client';

// actions/getSongsByTitle.ts

import axiosInstance from '@/libs/axios';
import { Song } from '@/types';

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Access token is missing');
      return [];
    }

    const response = await axiosInstance.get(`/posts/getSongsByTitle`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        title, // title을 쿼리 파라미터로 전달
      },
    });
    if (!response || !response.data) {
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id.toString(),
      ...item,
    }));
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getSongsByTitle;

'use client';

// actions/getSongsByUserId.ts

import axiosInstance from '@/libs/axios';
import { Song } from '@/types';

const getSongsByUserId = async (): Promise<Song[]> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Access token is missing');
      return [];
    }

    const response = await axiosInstance.get(`/posts/getSongsByUserId`, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export default getSongsByUserId;

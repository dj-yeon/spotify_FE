import axiosInstance from '@/libs/axios';
import { Song } from '@/types';
import { cookies } from 'next/headers';

const getLikedSongs = async (): Promise<Song[]> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('accessToken')?.value; // accessToken 쿠키를 가져옴

    if (!token) {
      // console.error('Access token is missing');
      return [];
    }

    const response = await axiosInstance.get(`/posts/getLikedSongs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response || !response.data) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getLikedSongs;

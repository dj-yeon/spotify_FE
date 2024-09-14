import axiosInstance from '@/libs/axios';
import { Song } from '@/types';

const getSongs = async (): Promise<Song[]> => {
  try {
    const response = await axiosInstance.get<[]>('/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getSongs;

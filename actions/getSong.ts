import axiosInstance from '@/libs/axios';

const getSongs = async (): Promise<[]> => {
  try {
    const response = await axiosInstance.get<[]>('/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getSongs;

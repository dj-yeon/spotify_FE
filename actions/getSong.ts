import axiosInstance from '@/libs/axios';
import { Song } from '@/types';

const getSongs = async (cursor: number | null = null): Promise<Song[]> => {
  try {
    // 커서가 있으면 `where__id__less_than` 쿼리 파라미터로 추가
    const query = cursor ? `?where__id__more_than=${cursor}` : '';
    const response = await axiosInstance.get<{ data: Song[] }>(
      `/posts${query}`,
    );

    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getSongs;

import axiosInstance from '@/libs/axios';
import { Song } from '@/types';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const useGetSongById = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Song | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      try {
        const response = await axiosInstance.get(`/common/getsongbyid/${id}`);

        const data = response.data;

        setSong(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          // AxiosError인 경우
          toast.error(error.response?.data?.message || error.message);
        } else {
          // 그 외의 에러인 경우
          toast.error('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  return useMemo(() => ({ isLoading, song }), [isLoading, song]);
};

export default useGetSongById;

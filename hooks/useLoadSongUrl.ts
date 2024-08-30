import axiosInstance from '@/libs/axios';
import { Song } from '@/types';
import { useEffect, useState } from 'react';

const useLoadSong = (song: Song) => {
  const [songUrl, setSongUrl] = useState('');

  useEffect(() => {
    if (!song) return;

    const fetchSongUrl = async () => {
      try {
        const response = await axiosInstance.get(
          `/common/song/${song.songFileName}`,
          {
            responseType: 'blob', // 이미지 데이터를 Blob으로 받아오기
          },
        );

        const songBlob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const songObjectUrl = URL.createObjectURL(songBlob);
        setSongUrl(songObjectUrl);
      } catch (error) {
        console.error('Error loading song:', error);
      }
    };

    fetchSongUrl();
  }, [song, song?.songFileName]);

  return songUrl;
};

export default useLoadSong;

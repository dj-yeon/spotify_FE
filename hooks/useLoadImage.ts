import axiosInstance from '@/libs/axios';
import { Song } from '@/types';
import { useState, useEffect } from 'react';

const useLoadImage = (song: Song) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!song || !song.imageFileName) {
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(
          `/common/image/${song.imageFileName}`,
          {
            responseType: 'blob', // 이미지 데이터를 Blob으로 받아오기
          },
        );
        const imageBlob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectUrl);
      } catch (error) {
        console.error('Failed to load image:', error);
        setImageUrl('/images/liked.png'); // 기본 이미지 설정
      }
    };

    fetchImage();
  }, [song]);

  return imageUrl;
};

export default useLoadImage;

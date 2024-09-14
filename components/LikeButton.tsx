'use client';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import axiosInstance from '@/libs/axios';

import Cookies from 'js-cookie';

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  // 토큰을 한 번만 가져옴
  const token = Cookies.get('accessToken');

  useEffect(() => {
    if (!token) {
      // console.error('Access token is missing');
      return;
    }

    if (!user?.email) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/posts/isLikedSong/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // AccessToken 추가
            },
          },
        );

        if (response.data.isLiked) {
          setIsLiked(true);
        }
      } catch (error) {
        console.error('Failed to fetch like status', error);
      }
    };

    fetchData();
  }, [songId, user?.email, token]); // token이 변경될 가능성을 대비하여 의존성 배열에 추가

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!token) {
      // console.error('Access token is missing');
      return;
    }

    try {
      if (isLiked) {
        await axiosInstance.delete(`/posts/likedSong/${songId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsLiked(false);
      } else {
        await axiosInstance.post(
          `/posts/likedSong`,
          { songId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsLiked(true);
        toast.success('Liked!');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }

    router.refresh();
  };

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
};

export default LikeButton;

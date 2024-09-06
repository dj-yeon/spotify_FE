'use client';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import axios from 'axios';
import axiosInstance from '@/libs/axios';

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/posts/isLikedSong/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // AccessToken 추가
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
  }, [songId, user?.email]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    try {
      if (isLiked) {
        await axiosInstance.delete(`/posts/likedSong/${songId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setIsLiked(false);
      } else {
        await axiosInstance.post(
          `/posts/likedSong`,
          { songId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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

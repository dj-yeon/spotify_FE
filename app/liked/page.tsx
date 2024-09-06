'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/libs/axios';
import Header from '@/components/Header';
import Image from 'next/image';
import LikedContent from './components/LikedContent';
import { Song } from '@/types';

const Liked = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const getLikedSongs = async (): Promise<Song[]> => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Access token is missing');
          setError(true);
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

        if (Array.isArray(response.data)) {
          return response.data.map((item: any) => ({
            ...item,
          }));
        } else {
          console.error('Unexpected response data format:', response.data);
          setError(true);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch songs:', error);
        setError(true);
        return [];
      }
    };

    getLikedSongs().then(setSongs);
  }, []);

  if (error) {
    return (
      <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
        <Header>
          <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
            Failed to load liked songs
          </h1>
        </Header>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                alt="Playlist"
                className="object-cover"
                src="/images/liked.png"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;

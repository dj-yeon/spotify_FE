'use client';

import getSongsByTitle from '@/actions/getSongsByTitle';
import LikeButton from '@/components/LikeButton';
import MediaItem from '@/components/MediaItem';
import useOnPlay from '@/hooks/useOnPlay';
import { Song } from '@/types';
import { useEffect, useState } from 'react';

interface SearchContentProps {
  searchParams: {
    title: string;
  };
}

const SearchContent: React.FC<SearchContentProps> = ({ searchParams }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const onPlay = useOnPlay(songs);

  // API 요청을 통해 노래 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    const fetchSongs = async () => {
      const songsData = await getSongsByTitle(searchParams.title);
      setSongs(songsData);
    };

    if (searchParams.title) {
      fetchSongs();
    }
  }, [searchParams.title]);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No songs found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
          </div>
          <LikeButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;

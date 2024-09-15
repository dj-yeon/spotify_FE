'use client';

import { useState, useEffect } from 'react';
import getSongs from '@/actions/getSong';
import { Song } from '@/types';
import PageContent from './components/PageContent';
import Header from '@/components/Header';
import ListItem from '@/components/ListItem';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]); // 상태를 Song[]로 명시
  const [cursor, setCursor] = useState<number | null>(null); // 커서 상태는 number 또는 null
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreSongs = async () => {
    const newSongs = await getSongs(cursor);

    if (newSongs.length > 0) {
      setSongs((prevSongs) => {
        // 중복된 곡 제거: 이미 존재하는 곡은 추가하지 않음
        const uniqueSongs = newSongs.filter(
          (newSong) => !prevSongs.some((song) => song.id === newSong.id),
        );

        return [...prevSongs, ...uniqueSongs];
      });
      // 커서를 숫자로 변환해서 설정
      setCursor(Number(newSongs[newSongs.length - 1].id));
    } else {
      setHasMore(false);
    }
  };

  // 최초 로드 시 데이터를 가져오는 로직
  useEffect(() => {
    fetchMoreSongs();
  }, []);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            There are two role: user, admin 유튜브와 강의를 참고하여 nestjs,
            nextjs를 사용한 포트폴리오를 만들어 보았다. <br />
            현재 1년간 nextjs, nestjs를 이용해서 일하고 있다.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">Newest songs</h1>
        </div>
        <PageContent songs={songs} />
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={fetchMoreSongs}
            >
              + More
            </button>
          </div>
        )}
        {!hasMore && (
          <div className="text-center text-gray-400 mt-4">
            No more songs to load
          </div>
        )}
      </div>
    </div>
  );
}

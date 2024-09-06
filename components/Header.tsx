'use client';

import { useRouter } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

import useAuthModal from '@/hooks/useAuthModal';
import useJoinModal from '@/hooks/useJoinModal';
import { useUser } from '@/hooks/useUser';
import usePlayer from '@/hooks/usePlayer';

import Button from './Button';
import JoinModal from './JoinModal';

import { FaUserAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAccessToken } from '../hooks/AccessTokenContext';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const joinModal = useJoinModal();
  const router = useRouter();

  const { user } = useUser();

  const { accessToken, setAccessToken } = useAccessToken();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 클라이언트 측에서만 실행됨
      const token = localStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
      }
    }
  }, []); // 빈 배열로 useEffect를 설정해 처음에만 실행되도록 함

  useEffect(() => {
    if (accessToken) {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // accessToken이 변경될 때만 router.refresh()가 호출되도록 설정

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null); // 상태 초기화

    player.reset();
    router.refresh();

    toast.success('Logged out!');
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div
      className={twMerge(
        `
        h-fit
        bg-gradient-to-b
        from-emerald-800
        p-6
        `,
        className,
      )}
    >
      <div
        className="
            w-full
            mb-4
            flex
            items-center
            justify-between"
      >
        <div
          className="
            hidden
            md:flex
            gap-x-2
            items-center"
        >
          <button
            onClick={() => router.back()}
            className="
                rounded-full
                bg-black 
                flex 
                items-center 
                justify-center 
                hover:opacity-75 
                transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button
            onClick={() => router.forward()}
            className="
                rounded-full
                bg-black 
                flex 
                items-center 
                justify-center 
                hover:opacity-75 
                transition"
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="
                rounded-full 
                p-2 
                bg-white 
                flex
                items-center
                justify-center
                hover:opacity-75
                transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            className="
                rounded-full 
                p-2 
                bg-white 
                flex
                items-center
                justify-center
                hover:opacity-75
                transition"
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div
          className="
            flex
            justify-between
            items-center
            gap-x-4
        "
        >
          {accessToken ? (
            <div
              className="
                flex 
                gap-x-4 
                items-center
                "
            >
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push('/account')}
                className="bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={joinModal.onOpen}
                  className="
                    bg-transparent
                    text-neutral-300
                    font-medium
                "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={authModal.onOpen}
                  className="
                   bg-white
                   px-6
                   py-2
                "
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;

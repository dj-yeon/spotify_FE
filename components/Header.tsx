'use client';

import { useRouter } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import { FaUserAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

import useAuthModal from '@/hooks/useAuthModal';
import useJoinModal from '@/hooks/useJoinModal';
import { useUser } from '@/hooks/useUser';
import usePlayer from '@/hooks/usePlayer';

import Button from './Button';
import JoinModal from './JoinModal';
import useInfoModal from '@/hooks/useInfoModal';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const joinModal = useJoinModal();
  const infoModal = useInfoModal();

  const router = useRouter();

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);

    player.reset();
    router.refresh();

    toast.success('Logged out!');
    // window.location.reload(); // Refresh the page
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
          {user ? (
            <>
              <div>
                <Button
                  onClick={infoModal.onOpen}
                  className="
                  bg-transparent
                  text-neutral-300
                  font-medium
              "
                >
                  Site Guide
                </Button>
              </div>
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
            </>
          ) : (
            <>
              <div>
                <Button
                  onClick={infoModal.onOpen}
                  className="
                    bg-transparent
                    text-neutral-300
                    font-medium
                "
                >
                  Site Guide
                </Button>
              </div>
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

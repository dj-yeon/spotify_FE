'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { HiHome } from 'react-icons/hi';
import Box from './Box';
import SidebarItem from './SidebarItem';
import Library from './Library';
import { Song } from '@/types';
import usePlayer from '@/hooks/usePlayer';
import { twMerge } from 'tailwind-merge';
import getSongsByUserId from '@/actions/getSongsByUserId';

import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname !== '/search',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        active: pathname === '/search',
        href: '/search',
      },
    ],
    [pathname],
  );

  return (
    <div
      className={twMerge(
        `flex h-full`,
        player.activeId && 'h-[calc(100%-80px)]',
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box className="flex flex-col gap-y-4 px-5 py-4">
          {routes.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </Box>
        <Box className="overflow-y-auto flex-grow">
          <Library songs={songs} />
        </Box>
        <Box className="overflow-y-auto justify-end min-h-[20px]">
          <div className="text-white px-5 py-4 text-lg space-y-4">
            {/* USER Section */}
            <div>
              <h3 className="font-bold text-xl mb-2">USER Sample Account</h3>
              <p>
                <span className="font-semibold">ID:</span> user@dongju.link
              </p>
              <p>
                <span className="font-semibold">Password:</span> user
              </p>
            </div>

            {/* ADMIN Section */}
            <div>
              <h3 className="font-bold text-xl mb-2">ADMIN Sample Account</h3>
              <p>
                <span className="font-semibold">ID:</span> admin@dongju.link
              </p>
              <p>
                <span className="font-semibold"> Password:</span> admin
              </p>
            </div>
          </div>
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};

export default Sidebar;

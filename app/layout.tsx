import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import UserProvider from '@/hooks/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import getSongsByUserId from '@/actions/getSongsByUserId';
import Player from '@/components/Player';
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices';

// app/layout.tsx

const font = Figtree({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music!',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <UserProvider>
          <ModalProvider products={products} />
          <Sidebar songs={userSongs}>{children}</Sidebar>
          <Player />
        </UserProvider>
      </body>
    </html>
  );
}

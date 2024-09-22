'use client';

import { useEffect, useState } from 'react';

import Modal from '@/components/Modal';
import AuthModal from '@/components/AuthModal';
import UploadModal from '@/components/UploadModal';
import { ProductWithPrice } from '@/types';
import JoinModal from '@/components/JoinModal';
import InfoModal from '@/components/InfoModal';

interface ModalProviderProps {}

const ModalProvider: React.FC<ModalProviderProps> = ({}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <JoinModal />
      <UploadModal />
      <InfoModal />
    </>
  );
};

export default ModalProvider;

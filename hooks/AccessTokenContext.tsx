// AccessTokenContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessTokenContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AccessTokenContext = createContext<AccessTokenContextType | undefined>(
  undefined,
);

export const AccessTokenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setAccessToken(token);
      }
    }
  }, []);

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => {
  const context = useContext(AccessTokenContext);
  if (context === undefined) {
    throw new Error(
      'useAccessToken must be used within an AccessTokenProvider',
    );
  }
  return context;
};

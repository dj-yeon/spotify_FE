// import { Song } from '@/types';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';

// const getSongs = async (): Promise<Song[]> => {
//   const supabase = createServerComponentClient({
//     cookies: cookies,
//   });

//   const { data, error } = await supabase
//     .from('songs')
//     .select('*')
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.log(error);
//   }

//   return (data as any) || [];
// };

// export default getSongs;

import axiosInstance from '@/libs/axios';

const getSongs = async (): Promise<[]> => {
  try {
    const response = await axiosInstance.get<[]>('/posts');
    console.log('******* response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch songs:', error);
    return [];
  }
};

export default getSongs;

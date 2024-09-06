// 'use client';

// import axiosInstance from '@/libs/axios';
// import { Song } from '@/types';

// const getLikedSongs = async (): Promise<Song[]> => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       console.error('Access token is missing');
//       return [];
//     }

//     const response = await axiosInstance.get(`/posts/getLikedSongs`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response || !response.data) {
//       return [];
//     }

//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch songs:', error);
//     return [];
//   }
// };

// export default getLikedSongs;

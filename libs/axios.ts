// lib/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_BASE_URL, // API의 기본 URL을 환경 변수로 설정
  //timeout: 3000000, // 요청 타임아웃 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

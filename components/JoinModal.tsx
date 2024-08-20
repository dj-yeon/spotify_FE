'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import useJoinModal from '@/hooks/useJoinModal';

import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import axiosInstance from '@/libs/axios';
import { useUser } from '@/hooks/useUser';

const JoinModal = () => {
  const { setAccessToken, setRefreshToken, setUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 추가
  const router = useRouter();

  const { onClose, isOpen } = useJoinModal();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      setErrorMessage(null); // 제출 시 오류 메시지 초기화

      // axiosInstance를 사용하여 가입 요청을 보냅니다.
      const response = await axiosInstance.post('/auth/register/email', {
        nickname: values.nickname,
        email: values.email,
        password: values.password,
      });

      const accessToken = response.data.accessToken; // 토큰을 저장
      const refreshToken = response.data.refreshToken;
      const subscriptionDetail = response.data.subscriptionDetail;

      // 로그인 성공 처리
      setAccessToken(accessToken); // 컨텍스트에 토큰 설정
      setRefreshToken(refreshToken);

      router.refresh();

      toast.success('Logged in successfully!');

      reset();

      onClose();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong'); // 오류 메시지 설정
      toast.error('Something went wrong');

      // 콘솔에 자세한 에러 정보 출력
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
      console.error('Stack trace:', error.stack);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Welcome to join us"
      description="Join our Site"
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {errorMessage && (
          <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
        )}
        <Input
          id="nickname"
          disabled={isLoading}
          {...register('nickname', { required: true })}
          placeholder="Nickname"
        />
        <Input
          id="email"
          disabled={isLoading}
          {...register('email', { required: true })}
          placeholder="Email"
        />
        <Input
          id="password"
          disabled={isLoading}
          {...register('password', { required: true })}
          placeholder="Password"
          type="password"
        />
        <Button disabled={isLoading} type="submit">
          Join in!
        </Button>
      </form>
    </Modal>
  );
};

export default JoinModal;

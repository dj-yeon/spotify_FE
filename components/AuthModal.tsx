'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import useAuthModal from '@/hooks/useAuthModal';

import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import axiosInstance from '@/libs/axios';
import { useUser } from '@/hooks/useUser';

const AuthModal = () => {
  const { setUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { onClose, isOpen } = useAuthModal();

  // useEffect(() => {
  //   if (session) {
  //     router.refresh();
  //     onClose();
  //   }
  // }, [onClose, router, session]);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      id: '',
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

      // 이메일과 비밀번호를 base64로 인코딩
      const credentials = btoa(`${values.id}:${values.password}`);

      // axiosInstance를 사용하여 로그인 요청을 보냅니다.
      const response = await axiosInstance.post(
        '/auth/login/email',
        {},
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const accessToken = response.data.accessToken; // 토큰을 저장
      const refreshToken = response.data.refreshToken;
      const userDetail = response.data.userDetail;
      // const subscriptionDetail = response.data.subscriptionDetail;

      // accessToken을 HTTP-only 쿠키에 저장
      document.cookie = `accessToken=${accessToken}; Path=/; Secure; SameSite=Strict`;
      document.cookie = `refreshToken=${refreshToken}; Path=/; Secure; SameSite=Strict`;

      setUser(userDetail);

      router.refresh();

      toast.success('Logged in successfully!');

      //      window.location.reload(); // 페이지 새로고침

      reset();

      onClose();
    } catch (error) {
      toast.error('Something went wrong');

      // 콘솔에 자세한 에러 정보 출력
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Stack trace:', error.stack);
      } else {
        console.error('Unknown error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="id"
          disabled={isLoading}
          {...register('id', { required: true })}
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
          Log in
        </Button>
      </form>
    </Modal>
  );
};

export default AuthModal;

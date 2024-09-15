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
import Select from './Selectbox';
import { RolesEnum } from '@/types';

const JoinModal = () => {
  const { setUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 추가
  const router = useRouter();

  const { onClose, isOpen } = useJoinModal();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      role: '',
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
        role: values.role,
      });

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
        <Select
          id="role"
          disabled={isLoading}
          {...register('role', { required: true })}
          defaultValue={RolesEnum.USER} // USER 기본 선택
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value={RolesEnum.USER}>User</option>
          <option value={RolesEnum.ADMIN}>Admin</option>
        </Select>

        <Button disabled={isLoading} type="submit">
          Join in!
        </Button>
      </form>
    </Modal>
  );
};

export default JoinModal;

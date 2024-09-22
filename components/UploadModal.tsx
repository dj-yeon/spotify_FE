'use client';

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';

import axiosInstance from '@/libs/axios';
import useAuthModal from '@/hooks/useAuthModal';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const router = useRouter();
  const authModal = useAuthModal();

  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<FieldValues>({
      defaultValues: {
        author: '',
        title: '',
        song: '',
        image: '',
      },
    });

  const token = Cookies.get('accessToken'); // 클라이언트 측 쿠키에서 토큰을 가져옴

  useEffect(() => {
    if (!isLoading && !user) {
      return authModal.onOpen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router, user]);

  // When selecting a file, upload it first.
  const handleFileUpload = async (
    file: File,
    type: 'image' | 'song',
    inputRef: HTMLInputElement,
  ) => {
    const MAX_SIZE_MB = 5; // 5MB 제한
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 10MB를 바이트로 변환

    // 파일 크기 확인
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File size should not exceed ${MAX_SIZE_MB} MB.`);

      // 파일 입력 필드 초기화 (화면 상에서도 초기화)
      inputRef.value = ''; // 파일 입력 필드 값 리셋

      return null; // null을 반환하여 이후 처리 중단
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      setIsUploading(true);
      const response = await axiosInstance.post(`/common/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // AccessToken 추가
        },
      });

      return response.data.fileName;
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      toast.error(`Failed to upload ${type}.`);

      // 파일 입력 필드 초기화 (업로드 실패 시에도)
      inputRef.value = ''; // 파일 입력 필드 값 리셋

      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!values.image || !values.song || !values.title || !values.author) {
        toast.error('Missing fields');
        return;
      }

      const imageValue = getValues('image') || null;
      const songValue = getValues('song') || null;

      // postPosts 엔드포인트로 전송
      await axiosInstance.post(
        'posts/song',
        {
          title: values.title,
          author: values.author,
          imageFileName: imageValue, // 업로드된 이미지 파일 경로 사용
          songFileName: songValue, // 업로드된 노래 파일 경로 사용
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // AccessToken 추가
          },
        },
      );

      router.refresh();
      setIsLoading(false);
      toast.success('Song created!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <div className="text-sm text-gray-500">
          <p>
            If you need a sample song, you can download free music from the link
            below:
          </p>
          <a
            href="https://studio.youtube.com/channel/UC-u4YA1NtdEFQFMSu_tWEzA/music"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            Download Sample Music
          </a>
        </div>

        <Input
          id="title"
          disabled={isLoading || isUploading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading || isUploading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select an image(max.5mb)</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading || isUploading}
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              const inputRef = e.target; // 파일 입력 요소 참조

              if (file) {
                const fileName = await handleFileUpload(
                  file,
                  'image',
                  inputRef,
                );
                setValue('image', fileName); // 업로드된 파일 경로를 설정
              }
            }}
          />
        </div>

        <div>
          <div className="pb-1">Select a song file(max.5mb)</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading || isUploading}
            accept=".mp3"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              const inputRef = e.target;
              if (file) {
                const fileName = await handleFileUpload(file, 'song', inputRef);
                if (fileName) {
                  setValue('song', fileName);
                }
              }
            }}
          />
        </div>

        <Button disabled={isLoading || isUploading} type="submit">
          {isUploading ? 'Uploading...' : 'Create'}{' '}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;

'use client';

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import uniqid from 'uniqid';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import axiosInstance from '@/libs/axios';
import { useRouter } from 'next/navigation';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const router = useRouter();

  const { register, handleSubmit, reset, setValue, getValues } =
    useForm<FieldValues>({
      defaultValues: {
        author: '',
        title: '',
        song: '',
        image: '',
      },
    });

  // When selecting a file, upload it first.
  const handleFileUpload = async (file: File, type: 'image' | 'song') => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await axiosInstance.post(`/common/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // AccessToken 추가
        },
      });

      console.log('Upload successful:', response);

      return response.data.fileName;
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
      toast.error(`Failed to upload ${type}.`);
      throw error;
      ``;
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
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // AccessToken 추가
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
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const fileName = await handleFileUpload(file, 'song');
                setValue('song', fileName); // 업로드된 파일 경로를 설정
              }
            }}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const fileName = await handleFileUpload(file, 'image');
                setValue('image', fileName); // 업로드된 파일 경로를 설정
              }
            }}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;

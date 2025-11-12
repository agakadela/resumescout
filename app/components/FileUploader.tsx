import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileUpload: (file: File | null) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles[0] ?? null);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024, // 15MB
    onError: (error) => {
      console.error(error);
    },
  });

  const file = acceptedFiles[0] ?? null;

  return (
    <div className='w-full gradient-border' {...getRootProps()}>
      <input {...getInputProps()} />
      <div className='space-y-4 cursor-pointer'>
        <div className='mx-auto w-16 h-16 flex items-center justify-center'>
          <img src='/icons/info.svg' alt='Info' className='size-10' />
        </div>
        {file ? (
          <div className='flex items-center gap-2'>
            <img
              src={URL.createObjectURL(file)}
              alt='File'
              className='size-10'
            />
            <span>{file.name}</span>
          </div>
        ) : (
          <div>
            <p className='tet-lg text-gray-500'>
              <span className='font-semibold'>Click to upload</span>
            </p>
            <p className='tet-lg text-gray-500'>PDF (max. 15MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}

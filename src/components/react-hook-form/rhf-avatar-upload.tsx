import React, { useCallback } from 'react';

import Image from 'next/image';

import { alpha, Avatar, Box } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { useDropzone } from 'react-dropzone';

import { useFormContext } from 'react-hook-form';

type RHFAvatarUploadProps = {
  name: string;
  logo?: string | null;
};

export default function RHFAvatarUpload({ name, logo }: RHFAvatarUploadProps) {
  const { setValue, watch } = useFormContext();
  const currentFile = watch(name);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        setValue(name, acceptedFiles[0], { shouldValidate: true });
      }
    },
    [setValue, name]
  );

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  });

  const renderAvatar = () => {
    if (isDragActive) {
      return <CameraAltIcon sx={{ fontSize: 64, opacity: 0.5 }} />;
    }

    // Preview uploaded image
    if (currentFile instanceof File) {
      return (
        <Avatar
          sx={{
            minWidth: 200,
            minHeight: 200,
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.divider, 0.1),
            backgroundColor: 'transparent',
          }}
          variant="square"
        >
          <Image
            src={URL.createObjectURL(currentFile)}
            alt="uploaded-avatar"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Avatar>
      );
    }

    if (logo) {
      return <Avatar src={logo} sx={{ width: 200, height: 200 }} />;
    }

    // Default placeholder
    return <Avatar sx={{ width: 200, height: 200 }} />;
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 1,
        height: 1,
        p: 3,
        border: '0.5px solid',
        borderColor: (theme) => alpha(theme.palette.divider, 0.5),
        textAlign: 'center',
        cursor: 'pointer',
        minHeight: 320,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        },
      }}
    >
      <input {...getInputProps()} />
      {renderAvatar()}
    </Box>
  );
}

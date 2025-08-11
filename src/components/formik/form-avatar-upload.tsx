import React, { useCallback } from 'react';

import { alpha, Avatar, Box, Typography } from '@mui/material';
import Image from 'next/image';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import { useDropzone } from 'react-dropzone';
import { useField } from 'formik';

export default function FormAvatarUpload({
  name,
  logo,
}: {
  name: string;
  logo?: string | null;
}) {
  const [field, meta, { setValue }] = useField(name);

  const onDrop = useCallback(
    (acceptedFiles: File[] | File) => {
      setValue(acceptedFiles);
    },
    [setValue]
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
      }}
    >
      <input {...getInputProps()} />
      {isDragActive && <CameraAltIcon width={50} />}
      {!isDragActive && logo && !field.value && (
        <Avatar src={logo} sx={{ width: 200, height: 200 }} />
      )}
      {!isDragActive && !logo && !field.value && (
        <Avatar sx={{ width: 200, height: 200 }} />
      )}
      {!isDragActive && field.value && (
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
            src={URL.createObjectURL(field.value[0])}
            alt="logo"
            fill
            objectFit="contain"
            objectPosition="center"
          />
        </Avatar>
      )}
    </Box>
  );
}

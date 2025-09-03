import { mixed } from 'yup';

const FILE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function createLogoSchema() {
  return mixed<File>()
    .test(
      'fileSize',
      'File size exceeded limit',
      (value: File | null | undefined) => {
        if (!value) return false;
        return value.size <= FILE_SIZE_LIMIT;
      }
    )
    .test('fileType', 'Invalid file type', (value: File | null | undefined) => {
      if (!value) return false;
      return ALLOWED_FILE_TYPES.includes(value.type);
    });
}

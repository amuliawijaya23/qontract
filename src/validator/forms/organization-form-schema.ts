import { object, string, number, mixed } from 'yup';

const FILE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export function createOrganizationFormSchema() {
  return object().shape({
    logo: mixed<File>()
      .test(
        'fileSize',
        'File size exceeded limit',
        (value: File | null | undefined) => {
          if (!value) return false;
          return value.size <= FILE_SIZE_LIMIT;
        }
      )
      .test(
        'fileType',
        'Invalid file type',
        (value: File | null | undefined) => {
          if (!value) return false;
          return ALLOWED_FILE_TYPES.includes(value.type);
        }
      )
      .optional(),
    name: string().required('Required'),
    email: string().optional(),
    phoneNumber: string().optional(),
    whatsappNumber: string().optional(),
    websiteUrl: string().optional(),
    instagram: string().optional(),
    address: object({
      fullAddress: string().required('Required'),
      rt: number().required('Required').min(1, 'Minimum value is 1'),
      rw: number().required('Required').min(1, 'Minimum value is 1'),
      village: object({
        name: string().required('Required'),
        code: string().required('Required'),
      }).required(),
      district: object({
        name: string().required('Required'),
        code: string().required('Required'),
      }).required(),
      city: object({
        name: string().required(),
        code: string().required('Required'),
      }).required(),
      province: object({
        name: string().required('Required'),
        code: string().required('Required'),
      }).required(),
      country: string().required('Required').default('Indonesia'),
      postalCode: number().required('Required').min(1, 'Minimum value is 1'),
    }),
  });
}

import { InferType, number, object, string } from 'yup';

export function createAddressSchema() {
  return object().shape({
    fullAddress: string().required('Required'),
    rt: number().required('Required').min(1, 'Minimum value is 1'),
    rw: number().required('Required').min(1, 'Minimum value is 1'),
    village: string().required('Required'),
    district: string().required('Required'),
    city: string().required('Required'),
    province: string().required('Required'),
    country: string().required('Required').default('Indonesia'),
    postalCode: number().required('Required').min(1, 'Minimum value is 1'),
  });
}

export type IAddress = InferType<ReturnType<typeof createAddressSchema>>;

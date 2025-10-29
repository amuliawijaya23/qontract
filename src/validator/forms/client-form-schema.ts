import { InferType, object, string } from 'yup';
import { createAddressSchema } from './address-schema';
import { createLogoSchema } from './logo-schema';

export function createClientFormSchema() {
  return object().shape({
    logo: createLogoSchema().optional().nullable(),
    name: string().required('Required'),
    personInCharge: string().required('Required'),
    email: string().optional().nullable(),
    phoneNumber: string().optional().nullable(),
    address: createAddressSchema().required('Required'),
  });
}

export type IClientSchema = InferType<
  ReturnType<typeof createClientFormSchema>
>;

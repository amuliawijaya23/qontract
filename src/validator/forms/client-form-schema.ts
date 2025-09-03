import { InferType, object, string } from 'yup';
import { createAddressSchema } from './address-schema';
import { createLogoSchema } from './logo-schema';

export function createClientFormSchema() {
  return object().shape({
    logo: createLogoSchema().optional(),
    name: string().required('Required'),
    personInCharge: string().required('Required'),
    email: string().optional(),
    phoneNumber: string().optional(),
    address: createAddressSchema().required('Required'),
  });
}

export type IClientSchema = InferType<
  ReturnType<typeof createClientFormSchema>
>;

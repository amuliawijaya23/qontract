import { InferType, object, string } from 'yup';

export function createAddOrganizationFormSchema() {
  return object().shape({
    code: string().required('Required'),
  });
}

export type IAddOrganizationSchema = InferType<
  ReturnType<typeof createAddOrganizationFormSchema>
>;

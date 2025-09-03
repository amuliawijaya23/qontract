import { InferType, object, string } from 'yup';

export function createLoginFormSchema() {
  return object().shape({
    email: string().email('Invalid email address').required('Required'),
    password: string().required('Required'),
  });
}

export type ILoginSchema = InferType<ReturnType<typeof createLoginFormSchema>>;

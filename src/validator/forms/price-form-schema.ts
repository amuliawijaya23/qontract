import { InferType, number, object, string } from 'yup';

export function createPriceFormSchema() {
  return object().shape({
    name: string().required('Required'),
    brand: string().optional(),
    model: string().optional(),
    description: string().optional(),
    price: number().required('Required').min(100, 'Minimum value is 100'),
    unit: string().required('Required'),
  });
}

export type IPriceSchema = InferType<ReturnType<typeof createPriceFormSchema>>;

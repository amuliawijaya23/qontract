import { InferType, number, object, string } from 'yup';
import PriceListCategory from '../enums/price-list-category';

export function createPriceFormSchema() {
  return object().shape({
    name: string().required('Required'),
    category: string()
      .oneOf(Object.values(PriceListCategory))
      .required('Required'),
    brand: string().optional(),
    model: string().optional(),
    description: string().optional(),
    price: number().required('Required').min(100, 'Minimum value is 100'),
    unit: string().required('Required'),
  });
}

export type IPriceSchema = InferType<ReturnType<typeof createPriceFormSchema>>;

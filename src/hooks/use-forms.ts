import { useContext } from 'react';
import { FormsContext } from '@/components/form-control/form-control';

export default function useForms() {
  const context = useContext(FormsContext);

  if (!context) {
    throw new Error(`useForm must be used within FormControl`);
  }

  return context;
}

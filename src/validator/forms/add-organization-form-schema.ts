import { object, string } from 'yup';

export function createAddOrganizationFormSchema() {
  return object().shape({
    code: string().required('Required'),
  });
}

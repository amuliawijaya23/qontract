import { array, InferType, object, string } from 'yup';
import UserOrganizationRoles from '../enums/user-organization-roles';

export function createInvitationFormSchema() {
  return object().shape({
    emails: array(
      object().shape({
        email: string().email('Invalid Email Format').required('Required'),
      })
    )
      .min(1, 'At least 1 email is required')
      .required('Required'),
    role: string()
      .oneOf(Object.values(UserOrganizationRoles))
      .required('Required'),
  });
}

export type IInvitationSchema = InferType<
  ReturnType<typeof createInvitationFormSchema>
>;

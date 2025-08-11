import { object, string, ref } from 'yup';

export function createRegisterFormSchema() {
  return object().shape({
    firstName: string().required('Required'),
    lastName: string().optional(),
    email: string().email('Invalid email address').required('Required'),
    password: string()
      .required('Required')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Password must be at least 8 characters long, contain at least one number, and include at least one special character.'
      ),
    confirmPassword: string()
      .oneOf([ref('password')], 'Passwords does not match')
      .required('Required'),
  });
}

import { auth } from '@/firebase/config';
import { setupPresence } from '@/subscribers/auth';
import { ILoginSchema } from '@/validator/forms/login-form-schema';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface IUseSignIn {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useSignIn(props?: IUseSignIn) {
  return useMutation({
    mutationFn: async ({ email, password }: ILoginSchema) => {
      const response = await signInWithEmailAndPassword(auth, email, password);

      setupPresence(response.user.uid);

      return response.user;
    },
    ...props,
    retry: false,
  });
}

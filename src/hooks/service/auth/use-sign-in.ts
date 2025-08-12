import { auth } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface IUseSignIn {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useSignIn(props?: IUseSignIn) {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response.user;
    },
    ...props,
    retry: false,
  });
}

import { useMutation } from '@tanstack/react-query';
import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface IUseSignUp {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useSignUp(props?: IUseSignUp) {
  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(response.user, {
        displayName: `${firstName}${` ${lastName}` ? lastName : ''}`,
      });

      return {
        ...response.user,
        displayName: `${firstName}${` ${lastName}` ? lastName : ''}`,
      };
    },
    ...props,
    retry: false,
  });
}

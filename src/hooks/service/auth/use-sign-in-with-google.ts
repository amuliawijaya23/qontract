import { auth, provider } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { signInWithPopup } from 'firebase/auth';

interface IUseSignInWithGoogle {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useSignInWithGoogle(props?: IUseSignInWithGoogle) {
  return useMutation({
    mutationFn: async () => {
      await signInWithPopup(auth, provider);
    },
    ...props,
    retry: false,
  });
}

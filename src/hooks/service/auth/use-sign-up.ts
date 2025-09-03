import { useMutation } from '@tanstack/react-query';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { IRegisterSchema } from '@/validator/forms/register-form-schema';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { setupPresence } from '@/subscribers/auth';

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
    }: IRegisterSchema) => {
      const now = Timestamp.now();
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const displayName = `${firstName}${` ${lastName}` ? lastName : ''}`;
      await updateProfile(response.user, { displayName });

      await setDoc(doc(db, 'users', response.user.uid), {
        displayName,
        email: response.user.email,
        photoURL: response.user.photoURL || null,
        isOnline: true,
        lastActive: now,
        createdAt: now,
        updatedAt: now,
      });

      setupPresence(response.user.uid);

      return {
        ...response.user,
        displayName: `${firstName}${` ${lastName}` ? lastName : ''}`,
      };
    },
    ...props,
    retry: false,
  });
}

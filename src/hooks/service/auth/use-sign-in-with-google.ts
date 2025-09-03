import { auth, db, provider } from '@/firebase/config';
import { useMutation } from '@tanstack/react-query';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

interface IUseSignInWithGoogle {
  onSuccess?: VoidFunction;
  onError?: (e: Error) => void;
}

export default function useSignInWithGoogle(props?: IUseSignInWithGoogle) {
  return useMutation({
    mutationFn: async () => {
      const now = Timestamp.now();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || null,
          createdAt: now,
          updatedAt: now,
          isOnline: true,
          lastActive: now,
        });
      }

      return user;
    },
    ...props,
    retry: false,
  });
}

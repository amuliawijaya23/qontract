import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface ISubscribeUserOrganizations {
  userId: string;
  setOrganizations: () => void;
}

export default function subscribeOrganizations({
  userId,
  setOrganizations,
}: ISubscribeUserOrganizations) {
  if (!userId) return () => {};

  const orgCollection = collection(db, 'organization');
  const orgQuery = query(orgCollection, where(`members.${userId}`, '!=', null));

  const unsubscribe = onSnapshot(orgQuery, () => {
    setOrganizations();
  });

  return unsubscribe;
}

import { db } from '@/firebase/config';
import {
  collection,
  documentId,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

interface ISubscribeTeamUserOrg {
  userIds: string[];
  setMembers: () => Promise<void>;
}

export default function subscribeTeamMembers({
  userIds,
  setMembers,
}: ISubscribeTeamUserOrg) {
  const usersCollection = collection(db, 'users');
  const usersQuery = query(usersCollection, where(documentId(), 'in', userIds));

  const unsubscribeTeamMembers = onSnapshot(usersQuery, () => {
    setMembers();
  });

  return unsubscribeTeamMembers;
}

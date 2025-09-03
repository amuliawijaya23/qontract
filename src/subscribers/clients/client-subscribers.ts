import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface ISubscribeClients {
  organizationId: string;
  setClients: () => void;
}

export default function subscribeClients({
  organizationId,
  setClients,
}: ISubscribeClients) {
  const clientCollection = collection(db, 'client');
  const clientQuery = query(
    clientCollection,
    where('organizationId', '==', organizationId)
  );

  const unsubscribe = onSnapshot(clientQuery, () => {
    setClients();
  });

  return unsubscribe;
}

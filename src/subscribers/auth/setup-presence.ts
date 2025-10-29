import { db } from '@/firebase/config';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';

export default async function setupPresence(userId: string) {
  const userRef = doc(db, 'users', userId);

  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return;

  await updateDoc(userRef, { isOnline: true, lastActive: Timestamp.now() });

  const interval = setInterval(() => {
    updateDoc(userRef, { lastActive: Timestamp.now(), isOnline: true });
  }, 60_000);

  return async () => {
    clearInterval(interval);
  };
}

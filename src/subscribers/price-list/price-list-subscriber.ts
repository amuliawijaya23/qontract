import { db } from '@/firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

interface ISubscribePriceList {
  organizationId: string;
  setPriceList: () => void;
}

export default function subscribePriceList({
  organizationId,
  setPriceList,
}: ISubscribePriceList) {
  const priceListCollection = collection(db, 'price-list');
  const priceListQuery = query(
    priceListCollection,
    where('organizationId', '==', organizationId)
  );

  const unsubscribe = onSnapshot(priceListQuery, () => {
    setPriceList();
  });

  return unsubscribe;
}

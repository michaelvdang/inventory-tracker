import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

import {serviceAccount} from'./my-inventory-tracker-5e9190110ce7';

initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();

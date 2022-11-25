import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseClientConfig } from "@fb/keys";

const app = initializeApp(firebaseClientConfig);

export const firestoreClient = getFirestore(app);
export const storageClient = getStorage(app);

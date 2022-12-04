import { firebaseClientConfig } from "@fb/keys";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseApp = initializeApp(firebaseClientConfig);

export const store = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

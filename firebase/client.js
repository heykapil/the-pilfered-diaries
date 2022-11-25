import { firebaseClientConfig } from "@fb/keys";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseClientConfig);

export const store = getFirestore(app);
export const storage = getStorage(app);

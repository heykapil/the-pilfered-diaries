import admin from "firebase-admin";
import { getServiceAccount } from "./serviceAccount";

if (!admin.apps.length) {
  try {
    const accountCreds = getServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(accountCreds),
    });
  } catch (error) {
    console.log("Failed to initialize firebase admin", error.stack);
  }
}

export default admin.firestore();

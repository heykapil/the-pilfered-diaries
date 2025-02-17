import { getServiceAccount } from "@fb/keys";
import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const accountCreds = getServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(accountCreds),
    });
  } catch (error) {
    console.error("Failed to initialize firebase admin", error.stack);
  }
}

export default admin.firestore();

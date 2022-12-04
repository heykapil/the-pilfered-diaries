export const getServiceAccount = () => {
  return {
    type: process.env.FB_SERVICE_ACCOUNT_TYPE,
    project_id: process.env.FB_SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY
      ? process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
    client_email: process.env.FB_SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.FB_SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.FB_SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.FB_SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FB_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FB_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  };
};

// Web app's Client Firebase SDK configuration.
export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

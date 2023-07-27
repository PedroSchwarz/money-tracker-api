import admin, { ServiceAccount } from 'firebase-admin';

export default admin;

export const initializeFirebaseConfig = async (adminConfig: ServiceAccount) => {
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
};

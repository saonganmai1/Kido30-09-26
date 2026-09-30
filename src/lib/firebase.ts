import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import firebaseAppletConfig from '@/firebase-applet-config.json';

const rawConfig: Record<string, any> = (firebaseAppletConfig && typeof firebaseAppletConfig === 'object') ? firebaseAppletConfig : {};

const safeConfig = {
  projectId: rawConfig.projectId || "ai-studio-applet-webapp-fd81c",
  appId: rawConfig.appId || "1:1087232162745:web:455a9c77a459aca96d5468",
  apiKey: rawConfig.apiKey || "AIzaSyD0trWCd-aWgapJ5hL7wu1op82Kjv2UWuw",
  authDomain: rawConfig.authDomain || (rawConfig.projectId ? `${rawConfig.projectId}.firebaseapp.com` : "ai-studio-applet-webapp-fd81c.firebaseapp.com"),
  firestoreDatabaseId: rawConfig.firestoreDatabaseId || "ai-studio-remixremixremixr-9d02299f-0b3a-4854-98cd-fc842ff437c1",
  storageBucket: rawConfig.storageBucket || (rawConfig.projectId ? `${rawConfig.projectId}.firebasestorage.app` : "ai-studio-applet-webapp-fd81c.firebasestorage.app"),
  messagingSenderId: rawConfig.messagingSenderId || "1087232162745",
};

let app;
try {
  app = getApps().length === 0 ? initializeApp(safeConfig) : getApps()[0];
} catch (e) {
  console.warn("Firebase initializeApp warning, using fallback app:", e);
  app = getApps()[0] || initializeApp({ apiKey: "demo-api-key", projectId: "demo-project" });
}

let firestoreInstance;
try {
  firestoreInstance = getFirestore(app, safeConfig.firestoreDatabaseId || '(default)');
} catch (e) {
  console.warn("getFirestore with databaseId failed, falling back to default:", e);
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.debug('Firestore Notice:', JSON.stringify(errInfo));
  return errInfo;
}

export async function testFirestoreConnection() {
  try {
    if (!safeConfig.apiKey || safeConfig.apiKey === 'demo-api-key' || safeConfig.projectId === 'demo-project') {
      return;
    }
    const checkPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 3000));
    await Promise.race([checkPromise, timeoutPromise]);
  } catch {
    // Quietly fallback to local cache / local-first mode
  }
}

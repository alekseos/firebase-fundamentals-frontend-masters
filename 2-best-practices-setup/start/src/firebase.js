import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  connectFirestoreEmulator,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { config } from "./config";

export function initialize() {
  const firebaseApp = initializeApp(config.firebase);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  if (location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9098");
    connectFirestoreEmulator(firestore, "localhost", 8081);
  }

  return { firebaseApp, auth, firestore };
}

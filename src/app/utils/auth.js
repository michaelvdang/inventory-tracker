import { getAuth, GoogleAuthProvider, onAuthStateChanged as _onAuthStateChanged, signInWithPopup, signOut as _signOut } from "firebase/auth";
import { app } from "./firebase";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export function onAuthStateChanged(cb) {
  console.log('onAuthStateChanged');
  return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {

  try {
  await signInWithPopup(auth, provider);
  } catch (error) {
  console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  const auth = getAuth();
  try {
  return auth.signOut();
  } catch (error) {
  console.error("Error signing out with Google", error);
  }
}

  
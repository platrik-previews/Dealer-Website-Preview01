import { useEffect, useState } from 'react';
import { app, firebaseEnabled } from '../lib/firebase';
import { business } from '../config/business';

const DEMO_AUTH_KEY = 'dealer-motion-demo-auth';

export function useAuth() {
  const dashboard = business.dashboard;
  const [user, setUser] = useState(() => {
    if (firebaseEnabled) return null;
    return sessionStorage.getItem(DEMO_AUTH_KEY) ? { email: dashboard.demoEmail, uid: 'demo-admin' } : null;
  });
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return undefined;
    let unsubscribe;
    let active = true;
    import('firebase/auth').then(({ getAuth, onAuthStateChanged }) => {
      if (!active) return;
      unsubscribe = onAuthStateChanged(getAuth(app), (nextUser) => { setUser(nextUser); setLoading(false); });
    }).catch(() => setLoading(false));
    return () => { active = false; unsubscribe?.(); };
  }, []);

  const login = async (email, password) => {
    if (firebaseEnabled) {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      return signInWithEmailAndPassword(getAuth(app), email, password);
    }
    if (email.trim().toLowerCase() !== dashboard.demoEmail || password !== dashboard.demoPassword) throw new Error('Invalid demo credentials.');
    sessionStorage.setItem(DEMO_AUTH_KEY, '1');
    const demoUser = { email: dashboard.demoEmail, uid: 'demo-admin' };
    setUser(demoUser);
    return { user: demoUser };
  };

  const logout = async () => {
    if (firebaseEnabled) {
      const { getAuth, signOut } = await import('firebase/auth');
      await signOut(getAuth(app));
    } else {
      sessionStorage.removeItem(DEMO_AUTH_KEY);
      setUser(null);
    }
  };

  return { user, loading, login, logout, firebaseEnabled };
}

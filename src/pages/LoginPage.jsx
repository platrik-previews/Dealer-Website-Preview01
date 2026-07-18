import { useEffect, useState } from 'react';
import { business } from '../config/business';
import { Mark, SmartLink } from '../components/SiteShell';
import { navigate } from '../hooks/usePathname';

export function LoginPage({ authState }) {
  const dashboard = business.dashboard;
  const [email, setEmail] = useState(authState.firebaseEnabled ? '' : dashboard.demoEmail);
  const [password, setPassword] = useState(authState.firebaseEnabled ? '' : dashboard.demoPassword);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (authState.user) navigate('/dashboard'); }, [authState.user]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await authState.login(email, password);
      navigate('/dashboard');
    } catch (nextError) {
      setError(nextError?.message?.replace('Firebase: ', '') || 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <SmartLink href="/" className="login-page__brand"><Mark /></SmartLink>
      <div className="login-page__art" aria-hidden="true"><div className="login-rings"><i /><i /><i /></div><span>INVENTORY</span></div>
      <section className="login-card">
        <p className="eyebrow">Restricted access</p><h1>Dealer login</h1><p>Manage listings, pricing, vehicle status and gallery images.</p>
        {!authState.firebaseEnabled && <div className="demo-notice"><strong>Demo mode</strong><span>The credentials are pre-filled. Listings and compressed images are stored locally in this browser.</span></div>}
        <form onSubmit={submit}><label><span>Email address</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label><label><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="button button--primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Access dashboard'}</button></form>
        <SmartLink href="/" className="back-link">← Return to website</SmartLink>
      </section>
    </main>
  );
}

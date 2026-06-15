import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const ADMIN_EMAIL = "steven.sparacino@bol-agency.com";

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (authLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', fontSize: 24 }}>Loading...</div>;

  if (!session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, fontFamily: 'sans-serif' }}>
        <h1>Las Culturitas 2026</h1>
        <p>Sign in to make your predictions</p>
        <button onClick={handleLogin} style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Las Culturitas 2026 Predictions</h1>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
      <p>Welcome, {session.user.user_metadata?.full_name || session.user.email}!</p>
      <p style={{ marginTop: 16, color: '#888' }}>Game coming soon — check back shortly.</p>
    </div>
  );
}

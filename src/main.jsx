
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabaseClient";
import "./style.css";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setMessage(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage(error.message);
    setSubmitting(false);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    setMessage(error ? error.message : "You have signed out.");
  }

  if (loading) {
    return <main className="container"><div className="card">Loading...</div></main>;
  }

  if (session) {
    return (
      <main className="container">
        <div className="card">
          <div className="logo">V</div>
          <h1>Welcome!</h1>
          <p>You are successfully logged in.</p>
          <p className="contact">{session.user.email}</p>
          <button onClick={handleLogout}>Sign out</button>
          {message && <p role="status">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="card">
        <div className="logo">V</div>
        <p className="eyebrow">VEDISS ORDERS</p>
        <h1>Sign in</h1>
        <p className="description">
          Enter your account details to access the application.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
        <div className="footer">Secure sign-in powered by Supabase</div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

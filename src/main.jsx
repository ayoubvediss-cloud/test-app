
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabaseClient";
import "./style.css";

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    if (!session) {
      setContacts([]);
      return;
    }

    async function loadContacts() {
      setContactsLoading(true);
      setMessage("");

      const { data, error } = await supabase
        .from("contacts")
        .select("id, name, email, created_at")
        .order("id", { ascending: false });

      if (error) {
        setMessage("Could not load contacts: " + error.message);
      } else {
        setContacts(data ?? []);
      }

      setContactsLoading(false);
    }

    loadContacts();
  }, [session]);

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
    if (error) setMessage(error.message);
    else setMessage("");
  }

  if (loading) {
    return <main className="container"><div className="card">Loading...</div></main>;
  }

  if (!session) {
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}
          <div className="footer">Secure sign-in powered by Supabase</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="card contacts-card">
        <div className="logo">V</div>
        <p className="eyebrow">VEDISS ORDERS</p>
        <h1>Contacts</h1>
        <p className="description">
          Signed in as {session.user.email}
        </p>

        <button onClick={handleLogout}>Sign out</button>

        {message && <p className="message">{message}</p>}

        <h2>Contacts database</h2>

        {contactsLoading ? (
          <p>Loading contacts...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.id}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>
                      {contact.created_at
                        ? new Date(contact.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {!contactsLoading && contacts.length === 0 && (
                  <tr>
                    <td colSpan="4">No contacts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

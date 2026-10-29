import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./supabaseClient";
import "./style.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Loading contacts...");
  const [saving, setSaving] = useState(false);

  async function loadContacts() {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage("Error: " + error.message);
      return;
    }

    setContacts(data);
    setMessage("");
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function addContact(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("contacts")
      .insert([{ name, email }]);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setName("");
      setEmail("");
      setMessage("Contact saved successfully!");
      await loadContacts();
    }

    setSaving(false);
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Database Test</h1>
        <p>Connected to Supabase PostgreSQL</p>

        <form onSubmit={addContact}>
          <input
            placeholder="Contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button disabled={saving}>
            {saving ? "Saving..." : "Save contact"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}

        <h2>Saved contacts ({contacts.length})</h2>

        {contacts.map((contact) => (
          <div className="contact" key={contact.id}>
            <strong>{contact.name}</strong>
            <div>{contact.email}</div>
          </div>
        ))}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
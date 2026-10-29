import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setMessage(`Welcome, ${name.trim()}! Your app is working.`);
  }

  return (
    <main className="container">
      <div className="card">
        <div className="logo">V</div>

        <p className="eyebrow">FIRST DEPLOYMENT</p>

        <h1>My First Web App</h1>

        <p className="description">
          A simple React application, ready to deploy
          using GitHub and Vercel.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Your name</label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button type="submit">Test my app</button>
        </form>

        {message && (
          <p className="message" role="status">
            {message}
          </p>
        )}

        <div className="footer">
          Built with React · Hosted on Vercel
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
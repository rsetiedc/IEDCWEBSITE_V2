import { useState } from "react";

import "./ContactForm.css";

// Web3Forms delivers form submissions straight to the team inbox (rsetiedc@rajagiritech.edu.in)
// with no backend needed. The access key is designed to be public — Web3Forms protects it
// with domain restrictions and spam filtering — so it is safe to embed in client-side code.
// Prefer the value from .env (VITE_WEB3FORMS_ACCESS_KEY); the known-good key below acts as a
// fallback so the form keeps working even if .env is missing or a dev server is running
// with an older env snapshot.
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "8a2bc9a4-18b6-4b4a-b581-19d16be204a3";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState(""); // hidden trap for bots
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear stale status banners as soon as the user starts editing again.
    if (status === "success" || status === "error") setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation (Web3Forms recommends JS checks over HTML
    // `required` attributes, which can interfere with its spam filter).
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          subject: formData.subject.trim() || "New message from the IEDC website",
          message,
          from_name: "IEDC Website Contact Form",
          replyto: email,
          botcheck: honeypot, // must stay empty — a filled value flags the submission as spam
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData(EMPTY_FORM);
        setHoneypot("");
        // Auto-dismiss the success banner after a few seconds.
        window.setTimeout(() => setStatus(null), 8000);
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Something went wrong sending your message. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error — please check your connection and try again.");
    }
  };

  return (
    <div className="contact-form-card">
      <span className="form-tag">Contact Us</span>

      <h2>If You Have Any Query, Please Contact Us</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot: invisible to humans; bots that fill it in get blocked */}
        <input
          type="text"
          name="botcheck"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="form-honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <textarea
          name="message"
          rows="7"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Message →"}
        </button>

        {status === "success" && (
          <p className="form-status form-status--success" role="status" aria-live="polite">
            ✓ Your message has been sent successfully! We'll get back to you soon.
          </p>
        )}

        {status === "error" && (
          <p className="form-status form-status--error" role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}

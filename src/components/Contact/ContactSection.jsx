import "./ContactSection.css";

import ContactForm from "./ContactForm";
import ContactMap from "./ContactMap";

export default function ContactSection() {
  return (
    <section className="contact-section">

      <ContactForm />

      <ContactMap />

    </section>
  );
}
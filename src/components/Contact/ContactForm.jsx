import "./ContactForm.css";

export default function ContactForm() {

  return (

    <div className="contact-form-card">

      <span className="form-tag">
        Contact Us
      </span>

      <h2>
        If You Have Any Query,
        Please Contact Us
      </h2>

      <form>

        <div className="form-grid">

          <input
            type="text"
            placeholder="Your Name"
          />

          <input
            type="email"
            placeholder="Your Email"
          />

        </div>

        <input
          type="text"
          placeholder="Subject"
        />

        <textarea
          rows="7"
          placeholder="Your Message"
        />

        <button type="submit">
          Send Message →
        </button>

      </form>

    </div>

  );

}
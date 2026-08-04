import "./ContactMap.css";

export default function ContactMap() {

  return (
    <div className="contact-map">
      <iframe
        title="IEDC RSET Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7858.4920160936235!2d76.35452093968435!3d9.996526626427563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080ca1bc66d917%3A0xca6f0ce6d121c322!2sRSET%20IEDC!5e0!3m2!1sen!2sin!4v1695142754498!5m2!1sen!2sin"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
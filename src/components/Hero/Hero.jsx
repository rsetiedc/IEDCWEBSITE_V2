import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import "./Hero.css";

import heroVideo from "../../assets/videos/hero.mp4";
import logo from "../../assets/logos/rset_innovation.png";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src={heroVideo} type="video/mp4" />
      </video>

      <div className="hero-overlay"></div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }} // Reduced y offset for smoother load
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // Disables continuous tracking after enter
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="hero-section">
          <div className="hero-top">

            <span className="hero-tag">
              Innovation • Entrepreneurship • Technology
            </span>
          </div>

          <h1>Think | Innovate | Inspire</h1>

          <p>
            We are RSET IEDC and IIC RSET, Rajagiri School of Engineering &
            Technology.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Explore</button>
            <button className="secondary-btn">Join Us</button>
          </div>
        </div>
      </motion.div>

      <div className="scroll-indicator">
        <FaArrowDown />
      </div>
    </section>
  );
}

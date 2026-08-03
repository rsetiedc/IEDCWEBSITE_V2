import { motion } from "framer-motion";
import "./AboutHero.css";

import banner from "../../assets/images/hero.jpg";

export default function AboutHero() {
  return (
    <section
      className="about-hero"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="about-hero-overlay" />

      <motion.div
        className="about-hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="about-hero-tag">
          About Us
        </span>

        <h1>
          Innovation Starts at RSET
        </h1>

        <p>
          Discover how RSET IEDC and Institution's Innovation Council (IIC)
          empower students to innovate, build startups and transform ideas into
          impactful solutions.
        </p>
      </motion.div>
    </section>
  );
}
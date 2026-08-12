import { motion, MotionConfig } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Hero.css";

import heroVideo from "../../assets/videos/hero.mp4";

/* Staggered reveal for the hero headline: each word rises, sharpens, and
   fades in one after another on every visit to the homepage. */
const titleVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.15 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Separator pipes get a gentler fade so the spotlight stays on the words */
const pipeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="hero" id="home">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        {/* Wave divider: smoothly curves the hero into the section below */}
        <div className="hero-wave" aria-hidden="true">
          <svg className="hero-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0a0f17" />
                <stop offset="100%" stopColor="#05080d" />
              </linearGradient>
              <linearGradient id="heroWaveEdge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff7a1a" stopOpacity="0" />
                <stop offset="30%" stopColor="#ff7a1a" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#ffb800" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#ff7a1a" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ff7a1a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="hero-wave-fill"
              d="M0,128 C180,264 420,32 720,96 C1020,160 1260,256 1440,160 L1440,320 L0,320 Z"
            />
            <path
              className="hero-wave-edge"
              d="M0,128 C180,264 420,32 720,96 C1020,160 1260,256 1440,160"
            />
          </svg>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="hero-section">
            <div className="hero-top">

              <span className="hero-tag">
                Innovation • Entrepreneurship • Technology
              </span>
            </div>

            <motion.h1 variants={titleVariants} initial="hidden" animate="visible">
              <motion.span variants={wordVariants}>Think</motion.span>
              <motion.span className="hero-pipe" variants={pipeVariants}>{" | "}</motion.span>
              <motion.span variants={wordVariants}>Innovate</motion.span>
              <motion.span className="hero-pipe" variants={pipeVariants}>{" | "}</motion.span>
              <motion.span variants={wordVariants}>Inspire</motion.span>
            </motion.h1>

            <p>
              We are RSET IEDC and IIC RSET
            </p>

            <div className="hero-buttons">
              <Link to="/about" className="primary-btn">
                Explore
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="scroll-indicator">
          <FaArrowDown />
        </div>
      </section>
    </MotionConfig>
  );
}

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Hero.css";

import heroVideo from "../../assets/videos/hero.mp4";

/* Hero headline sequence:
   Think → Innovate → Inspire → "Think . Innovate . Inspire"
   Each step fades/slides smoothly into the next; the final combined
   headline stays visible once the sequence completes. */
const HERO_WORDS = ["Think", "Innovate", "Inspire"];
const WORD_HOLD_MS = 1400; // how long each single word stays before transitioning

/* Shared enter/exit motion for every step of the headline sequence */
const headlineVariants = {
  initial: { opacity: 0, y: 24, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: "blur(10px)",
    transition: { duration: 0.45, ease: "easeIn" },
  },
};

export default function Hero() {
  /* step 0–2 cycles through the words; step 3 locks in the full headline */
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= HERO_WORDS.length) return undefined;
    const timer = setTimeout(() => setStep((s) => s + 1), WORD_HOLD_MS);
    return () => clearTimeout(timer);
  }, [step]);

  const showCombined = step >= HERO_WORDS.length;

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
            <h1>
              <AnimatePresence mode="wait">
                {showCombined ? (
                  <motion.span
                    key="combined-headline"
                    className="hero-headline-stage"
                    variants={headlineVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <span>Think</span>
                    <span className="hero-separator">{" . "}</span>
                    <span>Innovate</span>
                    <span className="hero-separator">{" . "}</span>
                    <span>Inspire</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key={HERO_WORDS[step]}
                    variants={headlineVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {HERO_WORDS[step]}
                  </motion.span>
                )}
              </AnimatePresence>
            </h1>

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

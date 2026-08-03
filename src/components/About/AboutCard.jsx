import "./AboutCard.css";
import { motion } from "framer-motion";

export default function AboutCard({ icon, title, text }) {
  return (
    <motion.div
      className="about-card"
      whileHover={{
        y: -8,
        rotateX: 4,
        rotateY: -4,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
    >
      <div className="about-card-header">
        <div className="about-card-icon">
          {icon}
        </div>

        <h3 className="about-card-title">
          {title}
        </h3>
      </div>

      <p className="about-card-body">
        {text}
      </p>
    </motion.div>
  );
}
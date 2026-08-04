import "./ObjectiveCard.css";
import { motion } from "framer-motion";

export default function ObjectiveCard({
  icon,
  title,
  description,
  number,
  index,
}) {
  return (
    <motion.article
      className="objective-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      whileHover={{
        y: -8,
      }}
    >
      <div className="objective-top">

        <div className="objective-icon">
          {icon}
        </div>

        <span className="objective-number">
          {number}
        </span>

      </div>

      <h3>{title}</h3>

      <p>{description}</p>

    </motion.article>
  );
}
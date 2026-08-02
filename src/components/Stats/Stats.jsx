import { motion } from "framer-motion";
import { FaUsers, FaCalendarAlt, FaTrophy, FaRocket } from "react-icons/fa";

import AnimatedCounter from "./CountUp";
import "./Stats.css";

const stats = [
  {
    icon: <FaUsers />,
    target: 3000,
    suffix: "+",
    label: "Members",
  },
  {
    icon: <FaCalendarAlt />,
    target: 200,
    suffix: "+",
    label: "Events",
  },
  {
    icon: <FaTrophy />,
    target: 2021,
    label: "IPL Winners",
  },
  {
    icon: <FaRocket />,
    target: 2023,
    label: "IEDC Summit Host",
  },
];

export default function Stats() {
  return (
    <section className="stats-section">
      <motion.div
        className="stats-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.15,
            }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
            }}
          >
            <div className="stat-icon">{stat.icon}</div>

            <div className="stat-number">
              <AnimatedCounter end={stat.target} suffix={stat.suffix} />
            </div>

            <p>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

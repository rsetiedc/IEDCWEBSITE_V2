import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBullseye, FaRocket, FaArrowRight } from "react-icons/fa";

import AboutCard from "./AboutCard";

import mainImage from "../../assets/images/iic-main.jpg";
import badgeImage from "../../assets/images/iic-badge.jpg";

const cards = [
  {
    title: "Vision",
    icon: <FaBullseye />,
    text: "To evolve as a support system within the institution that aids in creating innovative ideas of social relevance, thereby introducing a culture of innovation and entrepreneurship which will strengthen our education system and also promote national economic and social growth.",
  },
  {
    title: "Mission",
    icon: <FaRocket />,
    text: "To develop and strengthen an ecosystem that supports the students and faculty to innovate and prototype their potential ideas with industrial standards and support from Government, industry and reputed academic institutions around the world.",
  },
];

export default function IICAbout() {
  return (
    <section className="about-section">
      <div className="about-container reverse">
        {/* Left Content */}

        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="about-tag">About IIC RSET</span>

          <h2 className="about-title">
            IIC - Rajagiri School of
            Engineering & Technology
            (RSET)
          </h2>

          <div className="about-cards">
            {cards.map((card) => (
              <AboutCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                text={card.text}
              />
            ))}
          </div>

          <Link to="/contact" className="about-btn">
            Contact Us
            <FaArrowRight />
          </Link>
        </motion.div>

        {/* Right Images */}

        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="about-left-wrapper">
            <img
              src={mainImage}
              alt="IIC Activities"
              className="about-main-image"
            />

            <img
              src={badgeImage}
              alt="IIC Team"
              className="about-badge-image"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
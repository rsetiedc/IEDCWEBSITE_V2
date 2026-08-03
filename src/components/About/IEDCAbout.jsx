import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBullseye, FaRocket, FaArrowRight } from "react-icons/fa";

import AboutCard from "./AboutCard";

import groupPhoto from "../../assets/images/home-about.jpg";
import badgeImage from "../../assets/images/about-banner.jpg";

const cards = [
  {
    title: "Vision",
    icon: <FaBullseye />,
    text: "To be a self-sustained TBI catering to the needs of young student entrepreneurs with innovative ideas of social relevance and there by introducing a culture of entrepreneurship inside campus which will strengthen our education system and there by promoting the national economical and social growth",
  },
  {
    title: "Mission",
    icon: <FaRocket />,
    text: "To develop an ecosystem with required infrastructure that can enable students and faculty to innovate and prototype their potential ideas with industrial standards and support from Government, industry and reputed academic institutions around the world and help them to realize their potentials",
  },
];

export default function IEDCAbout() {
  return (
    <section className="about-section">

      <div className="about-container">

        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="about-left-wrapper">

            <img
              src={groupPhoto}
              alt="IEDC"
              className="about-main-image"
            />

            <img
              src={badgeImage}
              alt="Badge"
              className="about-badge-image"
            />

          </div>
        </motion.div>

        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >

          <span className="about-tag">
            About RSET IEDC
          </span>

          <h2 className="about-title">
            Building Young Student Entrepreneurs
          </h2>

          <div className="about-cards">
            {cards.map((card) => (
              <AboutCard
                key={card.title}
                {...card}
              />
            ))}
          </div>

          <Link
            to="/contact"
            className="about-btn"
          >
            Contact Us
            <FaArrowRight />
          </Link>

        </motion.div>

      </div>

    </section>
  );
}
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./HomeAbout.css";

import aboutImage from "../../assets/images/home-about.jpg";

export default function HomeAbout() {
  return (
    <section id="about" className="home-about">
      <div className="home-about-container">

        {/* Content Column */}
        <motion.div
          className="home-about-content"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >

          <h2>
            Be a part of the most vibrant organization in RSET
          </h2>

          {/* Paragraph Card Box */}
          <div className="about-text-card">
            <p>
              At RSET, IEDC and IIC work together to foster a culture of innovation, entrepreneurship, and creativity among students.
              RSET IEDC (Innovation and Entrepreneurship Development Centre) nurtures aspiring entrepreneurs by providing a platform to transform ideas into impactful ventures, develop skills, and explore the startup ecosystem with the support of the Kerala Startup Mission.
            </p>
            <p>
              IIC RSET (Institution’s Innovation Council) complements this vision by encouraging innovation, creative thinking, research, and problem-solving, helping students turn their ideas into meaningful solutions.
            </p>
            <p>
              Together, IEDC and IIC create a vibrant ecosystem where students can think, innovate, build, and inspire. Come and be a part of one of the most dynamic innovation and entrepreneurship communities at RSET.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="about-btn-group">
            <Link to="/about" className="about-btn primary">
              Learn More
              <span className="btn-icon">
                <FaArrowRight />
              </span>
            </Link>

            <Link to="/contact" className="about-btn secondary">
              Contact Us
              <span className="btn-icon">
                <FaArrowRight />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Image Column */}
        <motion.div
          className="home-about-image"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img src={aboutImage} alt="IEDC RSET Team" />
        </motion.div>

      </div>
    </section>
  );
}

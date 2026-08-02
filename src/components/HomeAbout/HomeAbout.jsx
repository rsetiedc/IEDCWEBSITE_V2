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
          {/* Section Tag Badge */}
          <span className="section-tag">
            About RSET IEDC
          </span>

          <h2>
            Be a part of one of the most vibrant club in RSET
          </h2>

          {/* Paragraph Card Box */}
          <div className="about-text-card">
            <p>
              At RSET IEDC, we nurture students interested in establishing their
              startups and aim to ignite their entrepreneurial spirit right here
              at the campus at Rajagiri School of Engineering and Technology. The
              Innovation and Development Center (IEDC) not only acts as a
              facilitator that shapes students' ideas but also serves as a
              platform to showcase their skills. We are proud to have the backing
              of Kerala Startup Mission, which supports 283 IEDCs across the
              state. Come and be a part of the most funded club on the campus.
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

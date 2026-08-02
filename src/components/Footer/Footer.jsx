import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaFacebookF,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";

import "./Footer.css";

import rsetInnovation from "../../assets/logos/rset-innovation-w.png";
import iicLogo from "../../assets/logos/iic-logo-bw.png";
import jubilee from "../../assets/logos/rset-jubilee.jpeg";
import iedcLogo from "../../assets/logos/iedc_logo.png";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-grid">

        {/* RSET Innovation */}
        <div className="footer-column">

          <div className="footer-logo-container">
            <img
              src={rsetInnovation}
              alt="RSET Innovation"
              className="footer-logo footer-logo-large"
            />
          </div>

          <p>
            <FaMapMarkerAlt />
            RSET, Rajagiri Valley, Kakkanad, Kochi, Kerala
          </p>

          <p>
            <FaEnvelope />
            rsetiedc@rajagiritech.edu.in
          </p>

          <div className="socials">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaFacebookF /></a>
          </div>
        </div>

        {/* IIC */}
        <div className="footer-column">

          <div className="footer-logo-container">
            <img
              src={iicLogo}
              alt="IIC RSET"
              className="footer-logo"
            />
          </div>

          <p>
            <FaMapMarkerAlt />
            RSET, Rajagiri Valley, Kakkanad, Kochi, Kerala
          </p>

          <p>
            <FaEnvelope />
            iic_rset@rajagiritech.edu.in
          </p>

          <div className="socials">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-column">

          <h3>Contact Nodal Officer</h3>

          <p>
            <FaUser />
            Nitheesh Kurian
          </p>

          <p>
            <FaPhone />
            +91 94974 13879
          </p>

          <p>
            <FaEnvelope />
            nitheeshk@rajagiritech.edu.in
          </p>

        </div>

        {/* Partner Logos */}
        <div className="footer-column partner">

          <img
            src={jubilee}
            alt="RSET Silver Jubilee"
            className="partner-logo"
          />

          <img
            src={iedcLogo}
            alt="IEDC Kerala"
            className="partner-logo small"
          />

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 IEDC RSET • Designed & Developed by Tech Team
      </div>
    </footer>
  );
}

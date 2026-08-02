import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Navbar.css";

import logo from "../../assets/logos/iic-logo.jpg";
import logo1 from "../../assets/logos/rset_innovation.png";

const navItems = ["Home", "About", "Events", "Team", "Gallery", "Contact"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo-group">
          <a href="#" className="logo">
            <img src={logo} alt="IIC Logo" />
          </a>
          <a href="#" className="logo">
            <img src={logo1} alt="IEDC Logo" />
          </a>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <div
              key={item}
              className={`nav-item ${active === item ? "active" : ""}`}
              onClick={() => {
                setActive(item);
                setMenuOpen(false);
              }}
            >
              {active === item && (
                <motion.div
                  layoutId="navbar-pill"
                  className="active-pill"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </div>
          ))}
        </nav>

        <button
          className="menu-btn"
          aria-label="Toggle Navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Navbar.css";

import logo from "../../assets/logos/iic-logo.jpg";
import logo1 from "../../assets/logos/rset_innovation.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Team", path: "/team" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="logo-group">
          <Link to="/" className="logo">
            <img src={logo} alt="IIC Logo" />
          </Link>
          <Link to="/" className="logo">
            <img src={logo1} alt="IEDC Logo" />
          </Link>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <div key={item.name} className="nav-item">
                {isActive && (
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
                <NavLink
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={isActive ? "active" : ""}
                >
                  {item.name}
                </NavLink>
              </div>
            );
          })}
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

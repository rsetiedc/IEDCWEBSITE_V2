import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import HomeAbout from "./components/HomeAbout/HomeAbout";
import Stats from "./components/Stats/Stats";
import Gallery from "./components/Gallery/Gallery";
import About from "./components/About/About.jsx";

// Helper component to reset scroll position on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

//HomePage LAyout
function HomePage() {
  return (
    <>
      <Hero />
      <HomeAbout />
      <Stats />
    </>
  );
}

// Temporary Placeholder for pages in development
function ComingSoon({ pageTitle }) {
  return (
    <div
      style={{
        padding: "120px 20px 80px",
        textAlign: "center",
        minHeight: "60vh",
      }}
    >
      <h1>{pageTitle}</h1>
      <p style={{ color: "#888", marginTop: "12px" }}>
        This page is currently under construction.
      </p>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />

        {/* Active / In-Progress Pages */}
        <Route path="/events" element={<ComingSoon pageTitle="Events" />} />
        <Route path="/team" element={<ComingSoon pageTitle="Team" />} />
        <Route
          path="/contact"
          element={<ComingSoon pageTitle="Contact Us" />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

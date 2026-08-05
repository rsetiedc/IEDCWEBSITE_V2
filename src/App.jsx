import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import HomeAbout from "./components/HomeAbout/HomeAbout";
import Stats from "./components/Stats/Stats";
import Gallery from "./components/Gallery/Gallery";
import PastEvents from "./components/Gallery/PastEvents";
import Events from "./components/Events/Events.jsx";
import Reports from "./components/Reports/Reports.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact";
import Team from "./components/Team/Team.jsx";
import Particles from "./components/Particles/Particles";

// Helper component to reset scroll position on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// GitHub Pages serves 404.html for refreshes/direct deep links (e.g. /events).
// It redirects to /?p=<original-path>; restore that route here.
function RestoreRoute() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const target = new URLSearchParams(search).get("p");
    if (target) navigate(target, { replace: true });
  }, [search, navigate]);

  return null;
}

// HomePage Layout
function HomePage() {
  return (
    <>
      <Hero />
      <HomeAbout />
      <Stats />
      <Gallery />
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
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#05080d",
        overflowX: "hidden",
      }}
    >
      {/* Background Particles Container */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Particles
  particleColors={["#ffffff", "#ff6b00", "#ffffff"]}
  particleCount={250}
  particleSpread={8}
  speed={0.12}
  particleBaseSize={130}       /* Increased size dramatically */
  sizeRandomness={1.5}         /* High variance gives large foreground dots + small background dots */
  cameraDistance={12}          /* Pulls camera closer to make particles look larger */
  moveParticlesOnHover={true}
  particleHoverFactor={1.2}
  alphaParticles={false}        /* Solid white/orange circles like React Bits demo */
  disableRotation={false}
  pixelRatio={window.devicePixelRatio || 1}
/>
      </div>

      {/* Main Page Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <RestoreRoute />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/gallery"
            element={
              <>
                <Gallery /> <PastEvents />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import HomeAbout from "./components/HomeAbout/HomeAbout";
import Gallery from "./components/Gallery/Gallery";
import PastEvents from "./components/Gallery/PastEvents";
import Events from "./components/Events/Events.jsx";
import Reports from "./components/Reports/Reports.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact";
import Team from "./components/Team/Team.jsx";
import Particles from "./components/Particles/Particles";

// Background ambience tuning: a deliberately small particle count keeps the
// field subtle, and the pixel ratio is capped on small screens so the fixed
// background canvas stays cheap to render while scrolling.
function getParticleTuning() {
  const smallScreen = window.innerWidth < 768;
  return {
    count: smallScreen ? 90 : 200,
    pixelRatio: Math.min(window.devicePixelRatio || 1, smallScreen ? 1.5 : 2),
  };
}

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
      <Gallery />
    </>
  );
}

function App() {
  const particleTuning = getParticleTuning();

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
          particleCount={particleTuning.count}
          particleSpread={8}
          speed={0.005}                  /* Nearly static, ultra-calm background motion */
          particleBaseSize={60}         /* Small, subtle background dots */
          sizeRandomness={1.5}          /* High variance: small background dots + a few larger ones */
          opacity={0.8}                 /* Moderately dimmed so particles sit subtly behind content */
          cameraDistance={12}           /* Pulls camera closer to make particles look larger */
          moveParticlesOnHover={true}
          particleHoverFactor={0.07}     /* Mouse only nudges the field slightly */
          alphaParticles={false}        /* Solid white/orange circles */
          disableRotation={false}
          pixelRatio={particleTuning.pixelRatio}
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
                <Gallery showMarquee pageMode /> <PastEvents />
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
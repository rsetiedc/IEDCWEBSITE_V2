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

// Android/low-power devices: cap the WebGL pixel ratio and particle count on
// small screens so the fixed background canvas stays cheap to render while
// scrolling (high-DPR phones make 250 large point sprites very expensive).
function getParticleTuning() {
  const smallScreen = window.innerWidth < 768;
  return {
    count: smallScreen ? 120 : 250,
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
  speed={0.12}
  particleBaseSize={130}       /* Increased size dramatically */
  sizeRandomness={1.5}         /* High variance gives large foreground dots + small background dots */
  cameraDistance={12}          /* Pulls camera closer to make particles look larger */
  moveParticlesOnHover={true}
  particleHoverFactor={1.2}
  alphaParticles={false}        /* Solid white/orange circles like React Bits demo */
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
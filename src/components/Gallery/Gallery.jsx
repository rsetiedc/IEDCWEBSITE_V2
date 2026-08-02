import { motion } from "framer-motion";

import "./Gallery.css";

import img1 from "../../assets/gallery/01.jpg";
import img2 from "../../assets/gallery/02.jpg";
import img3 from "../../assets/gallery/03.jpg";
import img4 from "../../assets/gallery/04.jpg";

const galleryItems = [
  {
    id: 1,
    title: "Innovation Workshop",
    subtitle: "Technical Session",
    image: img1,
  },
  {
    id: 2,
    title: "Campus Meetup",
    subtitle: "Community Event",
    image: img2,
  },
  {
    id: 3,
    title: "Startup Discussion",
    subtitle: "Entrepreneurship",
    image: img3,
  },
  {
    id: 4,
    title: "Team Activities",
    subtitle: "IEDC RSET",
    image: img4,
  },
];

const scrollingImages = [...galleryItems, ...galleryItems];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section">

      <motion.div
        className="gallery-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >

        <span className="gallery-tag">
          Gallery
        </span>

        <h2 className="gallery-title">
          Moments That Inspire Innovation
        </h2>

        <p className="gallery-subtitle">
          A glimpse into workshops, hackathons, startup events,
          competitions and memorable moments from the IEDC community.
        </p>

      </motion.div>

      <div className="gallery-wrapper">

        <div className="gallery-track">

          {scrollingImages.map((item, index) => (

            <div
              key={`${item.id}-${index}`}
              className="gallery-card"
            >

              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
              />

              <div className="gallery-overlay">

                <h3>{item.title}</h3>

                <span>{item.subtitle}</span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

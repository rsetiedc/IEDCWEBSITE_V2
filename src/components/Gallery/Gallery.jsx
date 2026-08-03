import "./Gallery.css";

import img1 from "../../assets/gallery/01.jpg";
import img2 from "../../assets/gallery/02.jpg";
import img3 from "../../assets/gallery/03.jpg";
import img4 from "../../assets/gallery/04.jpg";
import img5 from "../../assets/gallery/05.jpg";

const images = [
  {
    id: 1,
    src: img1,
    title: "Innovation Workshop",
  },
  {
    id: 2,
    src: img2,
    title: "Campus Activities",
  },
  {
    id: 3,
    src: img3,
    title: "Startup Discussions",
  },
  {
    id: 4,
    src: img4,
    title: "IEDC Events",
  },
  {
    id: 5,
    src: img5,
    title: "past Events",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-header">
        <span className="gallery-tag">Gallery</span>

        <h2 className="gallery-title">Moments at RSET IEDC</h2>

        <p className="gallery-subtitle">
          A glimpse into our workshops, startup events, hackathons, community
          initiatives and memorable moments.
        </p>
      </div>

      <div className="gallery-accordion">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <img src={image.src} alt={image.title} />

            <div className="gallery-overlay">
              <h3>{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

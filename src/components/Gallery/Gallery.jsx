import "./Gallery.css";

import img1 from "../../assets/gallery/01.jpg";
import img2 from "../../assets/gallery/02.jpg";
import img3 from "../../assets/gallery/03.jpg";
import img4 from "../../assets/gallery/04.jpg";

const images = [
  { id: 1, src: img1, title: "Workshop" },
  { id: 2, src: img2, title: "Campus Activity" },
  { id: 3, src: img3, title: "Innovation Meet" },
  { id: 4, src: img4, title: "Tech Event" },
];

export default function Gallery() {
  return (
    <section className="gallery">
      <div className="gallery-header">
        <span className="gallery-tag">Gallery</span>
        <h2>Moments at RSET IEDC</h2>
        <p>A glimpse into our workshops, events and innovation ecosystem.</p>
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div className="gallery-card" key={image.id}>
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

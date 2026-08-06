import img01 from "../../assets/gallery/01.jpg";
import img02 from "../../assets/gallery/02.jpg";
import img03 from "../../assets/gallery/03.jpg";
import img04 from "../../assets/gallery/04.jpg";
import img05 from "../../assets/gallery/05.jpg";
import "./Gallery.css";

const galleryImages = [
  { id: 1, src: img01, title: "Innovation Workshop" },
  { id: 2, src: img02, title: "Campus Activities" },
  { id: 3, src: img03, title: "Startup Discussions" },
  { id: 4, src: img04, title: "IEDC Events" },
  { id: 5, src: img05, title: "past Events" },
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
        {galleryImages.map((image) => (
          <div className="gallery-item" key={image.id}>
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

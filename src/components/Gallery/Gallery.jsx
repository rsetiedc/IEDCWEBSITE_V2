import img01 from "../../assets/gallery/01.jpg";
import img02 from "../../assets/gallery/02.jpg";
import img03 from "../../assets/gallery/03.jpg";
import img04 from "../../assets/gallery/04.jpg";
import img05 from "../../assets/gallery/05.jpg";
import { FaStar } from "react-icons/fa";
import "./Gallery.css";
import ImageMarquee from "./ImageMarquee";

const galleryImages = [
  { id: 1, src: img01, title: "Innovation Workshop" },
  { id: 2, src: img02, title: "Campus Activities" },
  { id: 3, src: img03, title: "Startup Discussions" },
  { id: 4, src: img04, title: "IEDC Events" },
  { id: 5, src: img05, title: "Past Events" },
];

export default function Gallery({ showAccordion = true, showMarquee = false, pageMode = false }) {
  // Triplicate the image set to allow seamless infinite scrolling
  const tripledImages = [...galleryImages, ...galleryImages, ...galleryImages];

  const homepageStats = [
    { value: "3000+", label: "Members" },
    { value: "200+", label: "Events" },
    { value: "2021", label: "IPL Winners" },
    { value: "2023", label: "IEDC Summit Host" },
    { value: "2025", label: "IIC Regional Meet Host" },
    { rating: 4, label: "IIC RSET Rating" },
    { value: "17", label: "Startups incubated under Rajagiri ORBIIT" },
    { value: "14", label: "Startups pre-incubated under Rajagiri ORBIIT" },
  ];

  return (
    <section
      id="gallery"
      className={`gallery-section${pageMode ? " gallery-section--page" : ""}`}
    >
      <div className="gallery-header">
        {!pageMode && (
          <div className="gallery-stats-row">
            {homepageStats.map((stat, i) => (
              <div key={i} className="gallery-stat-box">
                {stat.rating ? (
                  <>
                    <div
                      className="rating-stars"
                      aria-label={`${stat.rating} out of 5 star rating for IIC RSET`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= stat.rating ? "star-on" : "star-off"}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <span className="stat-val">
                      {stat.rating}.0<span className="rating-max"> / 5</span>
                    </span>
                  </>
                ) : (
                  <span className="stat-val">{stat.value}</span>
                )}
                <span className="stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
        <span className="gallery-tag">Gallery</span>
        <h2 className="gallery-title">Moments & Memories at RSET IEDC</h2>
        {pageMode && (
          <p className="gallery-subtitle">
            Step into our vibrant ecosystem of innovation and creativity! From high-energy hackathons and hands-on technical workshops to inspiring founder talks, startup pitch showcases, and collaborative community initiatives — explore the pivotal moments that define our journey at Rajagiri School of Engineering & Technology.
          </p>
        )}
      </div>

      {showAccordion && (
        <div className="gallery-scroll-wrapper" aria-hidden="true">
          <div className="gallery-fade-left" />
          <div className="gallery-fade-right" />
          <div className="gallery-scroll-track">
            <div className="gallery-scroll-content">
              {tripledImages.map((image, index) => (
                <div className="gallery-item" key={`${image.id}-${index}`}>
                  <img src={image.src} alt={image.title} decoding="async" />
                  <div className="gallery-overlay">
                    <h3>{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMarquee && <ImageMarquee />}
    </section>
  );
}

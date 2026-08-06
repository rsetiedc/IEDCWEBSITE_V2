import { useMemo } from "react";
import { getEventCoverPhoto } from "../../services/galleryPhotos";
import "./ImageMarquee.css";

/**
 * ImageMarquee — infinitely looping horizontal carousel of event cover photos.
 *
 * The animation is mathematically seamless:
 * - The image sequence is duplicated 3× so there's always content visible
 * - CSS keyframes translate by exactly one set width before resetting
 * - Uses linear timing for constant speed
 * - No pauses, jumps, or visible resets
 */

const EVENT_NAMES = [
  "IEDC SUMMIT",
  "IIC REGIONAL MEET",
  "HACKSUS",
  "IGNIITE",
  "START-IT-UP",
];

export default function ImageMarquee() {
  // Collect cover photos for events that have them
  const images = useMemo(() => {
    return EVENT_NAMES.map((name) => ({
      name,
      src: getEventCoverPhoto(name),
    })).filter((img) => img.src !== null);
  }, []);

  // Don't render if no images
  if (images.length === 0) return null;

  // Duplicate the sequence 3× for seamless looping
  const tripled = [...images, ...images, ...images];

  return (
    <div className="marquee-wrapper" aria-hidden="true">
      {/* Fade edges for smooth blending */}
      <div className="marquee-fade-left" />
      <div className="marquee-fade-right" />

      <div className="marquee-track">
        <div className="marquee-content">
          {tripled.map((img, index) => (
            <div className="marquee-item" key={`${img.name}-${index}`}>
              <img
                src={img.src}
                alt={img.name}
                className="marquee-img"
                loading="lazy"
              />
              <div className="marquee-item-overlay">
                <span className="marquee-item-name">{img.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

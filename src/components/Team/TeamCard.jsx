import { useState } from "react";
import "./TeamCard.css";

import {
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

// Automatically import all images from assets/team
const images = import.meta.glob("../../assets/team/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const getImage = (filename) => {
  const path = Object.keys(images).find((key) =>
    key.endsWith(filename)
  );

  return path ? images[path] : "";
};

export default function TeamCard({ member }) {
  // Touch devices have no :hover — tapping the card flips it to the bio
  // (desktop still flips on hover; clicking also toggles as a bonus).
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);

  return (
    <div
      className={`team-card ${flipped ? "flipped" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`View bio of ${member.name}`}
      onClick={toggleFlip}
      onKeyDown={(e) => {
        // Only flip when the card itself is focused — Enter/Space pressed on
        // a child (e.g. a social link on the back face) must activate that
        // child instead of bubbling up and flipping the card.
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFlip();
        }
      }}
    >

      <div className="team-card-inner">

        {/* FRONT */}

        <div className="team-card-front">

          <img
            src={getImage(member.image)}
            alt={member.name}
            className="team-image"
          />

          <div className="team-front-content">

            <h3>{member.name}</h3>

            <p className="team-role">
              {member.role}
            </p>


          </div>

        </div>

        {/* BACK */}

        <div className="team-card-back">

          <div className="team-back-content">

            <h3>{member.name}</h3>

            <p className="team-back-role">
              {member.role}
            </p>

            <div className="divider" />

            <p className="team-bio">
              {member.bio ||
                "Passionate about innovation and entrepreneurship."}
            </p>

            <div
              className="team-socials"
              onClick={(e) => e.stopPropagation()}
            >

              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              )}

              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
              )}

              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
              )}

            </div>

          </div>

          <span className="card-watermark">
            {member.role && member.role.includes("IIC") ? "IIC" : "IEDC"}
          </span>

        </div>

      </div>

    </div>
  );
}
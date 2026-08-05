import "./TeamCard.css";

import {
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaSyncAlt,
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
  return (
    <div className="team-card">

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

            <div className="team-socials">

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
            IEDC
          </span>

        </div>

      </div>

    </div>
  );
}
import "./TeamSection.css";
import TeamCard from "./TeamCard";

export default function TeamSection({
  title,
  description,
  members,
}) {
  return (
    <section className="team-section">

      <div className="team-section-header">

        <h2>{title}</h2>

        {description && (
          <p>{description}</p>
        )}

      </div>

      <div className="team-grid">

        {members.map((member) => (
          <TeamCard
            key={member.name}
            member={member}
          />
        ))}

      </div>

    </section>
  );
}
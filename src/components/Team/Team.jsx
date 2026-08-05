import "./Team.css";

import TeamHero from "./TeamHero";
import TeamSection from "./TeamSection";

import { teams } from "./teamData";

export default function Team() {
  return (
    <main className="team-page">

      <TeamHero />

      {teams.map((team) => (
        <TeamSection
          key={team.title}
          title={team.title}
          description={team.description}
          members={team.members}
        />
      ))}

    </main>
  );
}
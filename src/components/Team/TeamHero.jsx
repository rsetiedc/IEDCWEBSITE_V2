import "./TeamHero.css";
import heroImage from "../../assets/team/0_hero.jpg";

export default function TeamHero() {
  return (
    <section 
      className="team-hero" 
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="team-hero-content">
        <span className="team-tag">Our Team</span>
        
        <h1>Meet Our Team</h1>

      </div>
    </section>
  );
}
import "./About.css";
import AboutHero from "./AboutHero";
import IEDCAbout from "./IEDCAbout";
import IICAbout from "./IICAbout";
import Objectives from "../Objectives/Objectives";

export default function About() {
  return (
    <main className="about-page">
      <AboutHero />
      <IEDCAbout />
      <IICAbout />
      <Objectives />
    </main>
  );
}
import "./Objectives.css";

import {
  FaLightbulb,
  FaRocket,
  FaHandsHelping,
  FaVenus,
  FaUsers,
} from "react-icons/fa";

import ObjectiveCard from "./ObjectiveCard";

const objectives = [
  {
    icon: <FaLightbulb />,
    title: "Foster Innovation",
    description:
      "Design and develop innovative products of social relevance.",
  },
  {
    icon: <FaRocket />,
    title: "Encourage Entrepreneurship",
    description:
      "Create entrepreneurial culture among faculty members, students and Alumni.",
  },
  {
    icon: <FaHandsHelping />,
    title: "Provide Entrepreneurial Support",
    description:
      "Support other institutions around RSET to mold and effectively carry out entrepreneurial activities in their campus.",
  },
  {
    icon: <FaVenus />,
    title: "Increase Representation of Women",
    description:
      "Encourage and facilitate the involvement of women in entrepreneurial endeavors.",
  },
  {
    icon: <FaRocket />,
    title: "More Startups",
    description:
      "Promote start-up initiatives from Faculty and Students.",
  },
  {
    icon: <FaUsers />,
    title: "Build Individuals",
    description:
      "Prepare students to finish their engineering studies equipped with all the entrepreneurial skills necessary to thrive in their future pursuits.",
  },
];

export default function Objectives() {
  return (
    <section className="objectives-section">
      <div className="objectives-header">

        <span className="objectives-tag">
          Our Aim
        </span>

        <h2 className="objectives-title">
          Objectives
        </h2>

        <p className="objectives-subtitle">
          The Innovation and Entrepreneurship Development Centre at RSET
          strives to nurture innovation, leadership and entrepreneurial
          thinking through these core objectives.
        </p>

      </div>

      <div className="objectives-grid">

        {objectives.map((objective, index) => (
          <ObjectiveCard
            key={objective.title}
            {...objective}
            number={String(index + 1).padStart(2, "0")}
            index={index}
          />
        ))}

      </div>
    </section>
  );
}
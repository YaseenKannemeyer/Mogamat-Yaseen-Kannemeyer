import StackIcons from "../components/TechStack";
import { ExpandableCard } from "../components/ExpandableCard";
import { BackgroundWrapper } from "../components/ProjectBackground";

const Projects = () => {
  return (
    <BackgroundWrapper>
      <div className="flex flex-col items-center md:items-start gap-4">
        <StackIcons />
        <ExpandableCard />
      </div>
    </BackgroundWrapper>
  );
};

export default Projects;

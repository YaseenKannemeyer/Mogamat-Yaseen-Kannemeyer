
import { ExpandableCard } from "../components/ExpandableCard";
import { BackgroundWrapper } from "../components/ProjectBackground";


const Projects = () => {
  return (
    <BackgroundWrapper>
      <div className="flex flex-col items-center md:items-start gap-4">
      
        <ExpandableCard />
      </div>
    </BackgroundWrapper>
  );
};

export default Projects;

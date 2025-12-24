import { motion } from "framer-motion";
import { WorkflowCard } from "./WorkflowCard";

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  services: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  nodeCount: number;
}

interface WorkflowResultsProps {
  workflows: Workflow[];
  onViewSetup: (workflowId: string) => void;
  isVisible: boolean;
}

export function WorkflowResults({ workflows, onViewSetup, isVisible }: WorkflowResultsProps) {
  if (!isVisible || workflows.length === 0) return null;

  return (
    <section className="relative px-4 py-12 pb-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Matching Workflows
          </h2>
          <p className="text-muted-foreground">
            Found {workflows.length} workflow{workflows.length !== 1 ? "s" : ""} that match your use case
          </p>
        </motion.div>

        {/* Workflow cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow, index) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onViewSetup={() => onViewSetup(workflow.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

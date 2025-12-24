import { motion } from "framer-motion";
import { NodeCard } from "@/components/ui/node-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Zap, Layers } from "lucide-react";

interface WorkflowCardProps {
  workflow: {
    id: string;
    name: string;
    description: string;
    trigger: string;
    services: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    nodeCount: number;
    score?: number;
    fileUrl?: string;
    fileType?: string;
  };
  onViewSetup: () => void;
  index: number;
}

const difficultyColors = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  advanced: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

export function WorkflowCard({ workflow, onViewSetup, index }: WorkflowCardProps) {
  const handleDownload = () => {
    if (workflow.fileUrl) {
      window.open(workflow.fileUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <NodeCard variant="active" className="p-5 h-full aspect-square flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Badge className={difficultyColors[workflow.difficulty] + " text-xs"}>
                {workflow.difficulty}
              </Badge>
              {workflow.score && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(workflow.score * 100)}% match
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3 w-3" />
              <span>{workflow.nodeCount}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
            {workflow.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-grow">
            {workflow.description}
          </p>

          {/* Trigger */}
          <div className="flex items-center gap-1.5 text-xs mb-3">
            <Zap className="h-3 w-3 text-secondary" />
            <span className="text-muted-foreground truncate">{workflow.trigger}</span>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {workflow.services.slice(0, 3).map((service) => (
              <Badge 
                key={service} 
                variant="outline" 
                className="border-node-border bg-muted/30 text-foreground text-xs px-2 py-0.5"
              >
                {service}
              </Badge>
            ))}
            {workflow.services.length > 3 && (
              <Badge 
                variant="outline" 
                className="border-node-border bg-muted/30 text-foreground text-xs px-2 py-0.5"
              >
                +{workflow.services.length - 3}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button 
              variant="default" 
              size="sm"
              className="flex-1 bg-primary text-primary-foreground hover:bg-accent text-xs"
              onClick={onViewSetup}
            >
              View Setup
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-node-border bg-transparent hover:bg-muted"
              onClick={handleDownload}
              disabled={!workflow.fileUrl}
              title={workflow.fileUrl ? "Download workflow file" : "No download available"}
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </NodeCard>
    </motion.div>
  );
}

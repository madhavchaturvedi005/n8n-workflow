import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NodeCard } from "@/components/ui/node-card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Key, ExternalLink, ChevronRight, Loader2, Info, Settings, FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { workflowApi, WorkflowDetails } from "@/services/workflowApi";
import { useToast } from "@/hooks/use-toast";

interface SetupGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: {
    name: string;
    nodes?: string[];
    fileUrl?: string;
    description?: string;
  } | null;
}

export function SetupGuide({ open, onOpenChange, workflow }: SetupGuideProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'setup'>('description');
  const [instructions, setInstructions] = useState<string>("");
  const [workflowDetails, setWorkflowDetails] = useState<WorkflowDetails | null>(null);
  const [isLoadingInstructions, setIsLoadingInstructions] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && workflow && workflow.nodes) {
      generateWorkflowDetails();
    }
  }, [open, workflow]);

  const generateWorkflowDetails = async () => {
    if (!workflow || !workflow.nodes) return;
    
    setIsLoadingDetails(true);
    try {
      const details = await workflowApi.getWorkflowDetails(
        workflow.name, 
        workflow.nodes,
        workflow.description
      );
      setWorkflowDetails(details);
    } catch (error) {
      console.error("Failed to generate workflow details:", error);
      toast({
        title: "Failed to Generate Details",
        description: "Using basic workflow information.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const generateInstructions = async () => {
    if (!workflow || !workflow.nodes || instructions) return;
    
    setIsLoadingInstructions(true);
    try {
      const generatedInstructions = await workflowApi.getSetupInstructions(
        workflow.name, 
        workflow.nodes
      );
      setInstructions(generatedInstructions);
    } catch (error) {
      console.error("Failed to generate instructions:", error);
      toast({
        title: "Failed to Generate Instructions",
        description: "Using fallback setup guide.",
        variant: "destructive",
      });
      
      // Fallback instructions
      setInstructions(`1. Import the workflow into your n8n instance
2. Configure credentials for the required services
3. Test the workflow with sample data
4. Activate the workflow when ready
5. Monitor the workflow execution logs`);
    } finally {
      setIsLoadingInstructions(false);
    }
  };

  const handleTabChange = (tab: 'description' | 'setup') => {
    setActiveTab(tab);
    if (tab === 'setup' && !instructions) {
      generateInstructions();
    }
  };

  const handleImportWorkflow = () => {
    if (workflow?.fileUrl) {
      window.open(workflow.fileUrl, '_blank');
    } else {
      window.open('https://n8n.io', '_blank');
    }
  };

  if (!workflow) return null;

  // Parse instructions into steps
  const steps = instructions
    .split('\n')
    .filter(line => line.trim())
    .map((line, index) => ({
      id: index + 1,
      content: line.replace(/^\d+\.\s*/, '').trim()
    }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card border-node-border max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {workflow.name}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Toggle */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
          <Button
            variant={activeTab === 'description' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "flex-1 gap-2",
              activeTab === 'description' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange('description')}
          >
            <Info className="h-4 w-4" />
            Description
          </Button>
          <Button
            variant={activeTab === 'setup' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "flex-1 gap-2",
              activeTab === 'setup' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange('setup')}
          >
            <Settings className="h-4 w-4" />
            Setup
          </Button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'description' ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {isLoadingDetails ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading workflow details...</span>
                  </div>
                ) : (
                  <>
                    {/* Description Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">Description</h3>
                      </div>
                      <NodeCard variant="default" className="p-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          {workflowDetails?.description || workflow.description || "No description available."}
                        </p>
                      </NodeCard>
                    </div>

                    {/* Requirements Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Key className="h-5 w-5 text-secondary" />
                        <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
                      </div>
                      <NodeCard variant="default" className="p-4">
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {workflowDetails?.requirements || "Loading requirements..."}
                        </div>
                      </NodeCard>
                    </div>

                    {/* Detailed Information Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="h-5 w-5 text-accent" />
                        <h3 className="text-lg font-semibold text-foreground">How It Works</h3>
                      </div>
                      <NodeCard variant="default" className="p-4">
                        <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {workflowDetails?.detailedInfo || "Loading detailed information..."}
                        </div>
                      </NodeCard>
                    </div>

                    {/* Workflow Stats */}
                    {workflowDetails && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold text-foreground">Workflow Stats</h3>
                        </div>
                        <div className="flex gap-4">
                          <Badge variant="outline" className="gap-2">
                            <Layers className="h-3 w-3" />
                            {workflowDetails.nodeCount} nodes
                          </Badge>
                          <Badge variant="outline" className="gap-2">
                            <FileText className="h-3 w-3" />
                            {workflowDetails.nodes.length} components
                          </Badge>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {isLoadingInstructions ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Generating setup instructions...</span>
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NodeCard 
                        variant="default"
                        hasLeftPort
                        hasRightPort={index < steps.length - 1}
                        className="relative"
                      >
                        {/* Connector line to next step */}
                        {index < steps.length - 1 && (
                          <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-node-connector" />
                        )}

                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">{step.id}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-relaxed">
                              {step.content}
                            </p>
                          </div>
                        </div>
                      </NodeCard>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <Button 
            variant="default" 
            className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
            onClick={handleImportWorkflow}
          >
            {workflow.fileUrl ? 'Download Workflow' : 'Open n8n'}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="border-node-border bg-transparent hover:bg-muted"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

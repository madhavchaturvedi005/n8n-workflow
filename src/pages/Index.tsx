import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { WorkflowResults } from "@/components/WorkflowResults";
import { SetupGuide } from "@/components/SetupGuide";
import { Workflow } from "lucide-react";
import { workflowApi, WorkflowSearchResult, WorkflowApiError } from "@/services/workflowApi";
import { useToast } from "@/hooks/use-toast";

// Sample workflow data
const sampleWorkflows = [
  {
    id: "1",
    name: "GitHub → Slack Issue Alerts",
    description: "Get instant Slack notifications whenever a new issue is created in your GitHub repository. Perfect for staying on top of bug reports and feature requests.",
    trigger: "GitHub Issue Created",
    services: ["GitHub", "Slack"],
    difficulty: "beginner" as const,
    nodeCount: 3,
  },
  {
    id: "2", 
    name: "Multi-Channel Social Scheduler",
    description: "Schedule and publish posts across Twitter, LinkedIn, and Facebook from a single Notion database or Airtable base.",
    trigger: "Schedule (Cron)",
    services: ["Notion", "Twitter", "LinkedIn", "Facebook"],
    difficulty: "intermediate" as const,
    nodeCount: 7,
  },
  {
    id: "3",
    name: "Website Uptime Monitor",
    description: "Monitor your website's availability and get immediate alerts via email and SMS when downtime is detected.",
    trigger: "HTTP Request (Webhook)",
    services: ["HTTP", "SendGrid", "Twilio"],
    difficulty: "beginner" as const,
    nodeCount: 4,
  },
];

const setupSteps = {
  "1": [
    { id: 1, title: "Create GitHub Trigger", description: "Add the GitHub trigger node and connect to your repository.", type: "action" as const },
    { id: 2, title: "Add GitHub Credentials", description: "Generate a personal access token from GitHub and add it to n8n.", type: "credential" as const },
    { id: 3, title: "Configure Slack Node", description: "Add the Slack node and select your target channel.", type: "action" as const },
    { id: 4, title: "Add Slack Credentials", description: "Connect your Slack workspace using OAuth.", type: "credential" as const },
    { id: 5, title: "Test & Activate", description: "Create a test issue to verify the workflow, then activate it.", type: "action" as const },
  ],
  "2": [
    { id: 1, title: "Set Schedule Trigger", description: "Configure the Cron node with your desired posting schedule.", type: "action" as const },
    { id: 2, title: "Connect Data Source", description: "Link your Notion database or Airtable base.", type: "action" as const },
    { id: 3, title: "Rate Limits", description: "Be aware of API rate limits on social platforms.", type: "warning" as const },
    { id: 4, title: "Add Social Credentials", description: "Connect each social platform using their OAuth flow.", type: "credential" as const },
    { id: 5, title: "Map Content Fields", description: "Configure how your database fields map to post content.", type: "action" as const },
  ],
  "3": [
    { id: 1, title: "Set HTTP Trigger", description: "Configure the HTTP Request node to ping your website.", type: "action" as const },
    { id: 2, title: "Add Response Check", description: "Add an IF node to check for non-200 status codes.", type: "action" as const },
    { id: 3, title: "Configure Email Alerts", description: "Add SendGrid node for email notifications.", type: "action" as const },
    { id: 4, title: "Add SendGrid API Key", description: "Get your API key from SendGrid dashboard.", type: "credential" as const },
  ],
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowSearchResult[]>([]);
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<{
    name: string;
    nodes?: string[];
    fileUrl?: string;
    description?: string;
  } | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await workflowApi.healthCheck();
      setApiConnected(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Backend Connection Issue",
          description: "Unable to connect to the API server. Please make sure the backend is running on port 3001.",
          variant: "destructive",
        });
      }
    };
    
    checkConnection();
  }, [toast]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setShowResults(false);
    
    try {
      const results = await workflowApi.searchWorkflows(searchQuery);
      setWorkflows(results);
      setShowResults(true);
      
      if (results.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search query or check if workflows are indexed in the database.",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      
      if (error instanceof WorkflowApiError) {
        toast({
          title: "Search Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred while searching. Please try again.",
          variant: "destructive",
        });
      }
      
      // Fallback to sample data for demo purposes
      setWorkflows(sampleWorkflows);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSetup = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    
    if (workflow) {
      setSelectedWorkflow({
        name: workflow.name,
        nodes: workflow.nodes || workflow.services,
        fileUrl: workflow.fileUrl,
        description: workflow.description,
      });
      setSetupGuideOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="n8n Workflow Finder" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-semibold text-foreground">n8n Workflow Finder</span>
            {apiConnected !== null && (
              <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                   title={apiConnected ? 'API Connected' : 'API Disconnected'} />
            )}
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="https://n8n.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              n8n.io
            </a>
            <a href="https://docs.n8n.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        <WorkflowResults
          workflows={workflows}
          onViewSetup={handleViewSetup}
          isVisible={showResults}
        />
      </main>

      {/* Setup Guide Modal */}
      <SetupGuide
        open={setupGuideOpen}
        onOpenChange={setSetupGuideOpen}
        workflow={selectedWorkflow}
      />
    </div>
  );
};

export default Index;

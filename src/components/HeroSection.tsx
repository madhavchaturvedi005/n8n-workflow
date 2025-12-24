import { motion } from "framer-motion";
import { FloatingElements } from "@/components/FloatingElements";
import { TypewriterInput } from "@/components/ui/typewriter-input";
import { Workflow, Sparkles, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const examplePrompts = [
  "Send Slack alerts when new GitHub issues are created",
  "Sync data between Notion and Airtable automatically",
  "Post to social media on a schedule",
  "Send email notifications for website downtime",
  "Create Trello cards from new form submissions",
  "Backup files to Google Drive daily",
  "Send SMS alerts for critical system errors",
  "Update CRM when new leads come in",
  "Generate reports and email them weekly",
  "Monitor RSS feeds and post updates"
];

export function HeroSection({ searchQuery, onSearchChange, onSearch, isLoading }: HeroSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    onSearchChange(example);
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Floating elements background */}
      <FloatingElements />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered Workflow Matching
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Find the right{" "}
            <span className="text-gradient">n8n workflow</span>
            <br />
            for your use case
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe what you want to automate, and we'll match you with the perfect workflow template—plus step-by-step setup guidance.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <TypewriterInput
            placeholder=""
            typewriterWords={examplePrompts}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            isLoading={isLoading}
          />
          
          <motion.button
            onClick={onSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-accent glow-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Workflow className="h-5 w-5" />
            {isLoading ? "Searching..." : "Find Workflows"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 pt-4"
        >
          <span className="text-sm text-muted-foreground">Try:</span>
          {examplePrompts.slice(0, 3).map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="text-sm text-primary hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              {example.length > 40 ? example.substring(0, 40) + "..." : example}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

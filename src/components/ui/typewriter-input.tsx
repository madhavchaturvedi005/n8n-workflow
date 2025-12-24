import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Workflow } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";

export interface TypewriterInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  typewriterWords?: string[];
}

const TypewriterInput = React.forwardRef<HTMLInputElement, TypewriterInputProps>(
  ({ className, isLoading, typewriterWords = [], value, ...props }, ref) => {
    const typewriterText = useTypewriter({
      words: typewriterWords,
      typeSpeed: 80,
      deleteSpeed: 40,
      delayBetweenWords: 2500,
      loop: true,
    });

    const showTypewriter = !value && typewriterWords.length > 0;

    return (
      <div className="relative w-full max-w-2xl">
        {/* Left port */}
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-3 h-3 rounded-full bg-node-port border-2 border-card" />
        </div>
        
        {/* Right port */}
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div 
            className="w-3 h-3 rounded-full bg-node-port border-2 border-card"
            animate={isLoading ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </div>

        <div className="relative flex items-center">
          <Workflow className="absolute left-4 h-5 w-5 text-muted-foreground z-20" />
          
          <input
            className={cn(
              "flex h-14 w-full rounded-lg border border-node-border bg-node px-12 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 node-shadow hover:node-shadow-hover",
              className
            )}
            value={value}
            ref={ref}
            {...props}
          />
          
          {/* Typewriter overlay */}
          {showTypewriter && (
            <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <span className="text-base font-medium text-muted-foreground">
                {typewriterText}
              </span>
              <span className="text-muted-foreground typewriter-cursor ml-0.5">|</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
TypewriterInput.displayName = "TypewriterInput";

export { TypewriterInput };
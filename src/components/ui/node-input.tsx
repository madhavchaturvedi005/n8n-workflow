import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export interface NodeInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

const NodeInput = React.forwardRef<HTMLInputElement, NodeInputProps>(
  ({ className, isLoading, ...props }, ref) => {
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
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            className={cn(
              "flex h-14 w-full rounded-lg border border-node-border bg-node px-12 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 node-shadow hover:node-shadow-hover",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
NodeInput.displayName = "NodeInput";

export { NodeInput };

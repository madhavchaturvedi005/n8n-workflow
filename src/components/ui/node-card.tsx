import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NodeCardProps {
  className?: string;
  variant?: "default" | "active" | "trigger";
  hasLeftPort?: boolean;
  hasRightPort?: boolean;
  children?: React.ReactNode;
}

const NodeCard = React.forwardRef<HTMLDivElement, NodeCardProps>(
  ({ className, variant = "default", hasLeftPort, hasRightPort, children }, ref) => {
    const variantStyles = {
      default: "border-node-border bg-node",
      active: "border-primary/50 bg-node glow-primary",
      trigger: "border-secondary/50 bg-node glow-secondary",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-lg border p-4 transition-all duration-200 node-shadow hover:node-shadow-hover",
          variantStyles[variant],
          className
        )}
        whileHover={{ y: -2 }}
      >
        {/* Left port */}
        {hasLeftPort && (
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className={cn(
              "w-3 h-3 rounded-full border-2 border-card",
              variant === "trigger" ? "bg-secondary" : "bg-node-port"
            )} />
          </div>
        )}
        
        {/* Right port */}
        {hasRightPort && (
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10">
            <div className={cn(
              "w-3 h-3 rounded-full border-2 border-card",
              variant === "trigger" ? "bg-secondary" : "bg-node-port"
            )} />
          </div>
        )}

        {children}
      </motion.div>
    );
  }
);
NodeCard.displayName = "NodeCard";

export { NodeCard };

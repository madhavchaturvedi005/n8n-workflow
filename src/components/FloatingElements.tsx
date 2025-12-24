import { motion } from "framer-motion";
import { Code, Bot, Search, Users, Settings, Workflow } from "lucide-react";

const floatingIcons = [
  { Icon: Code, x: "10%", y: "20%", delay: 0, size: 20 },
  { Icon: Bot, x: "85%", y: "15%", delay: 0.5, size: 22 },
  { Icon: Search, x: "90%", y: "60%", delay: 1, size: 18 },
  { Icon: Users, x: "8%", y: "70%", delay: 1.5, size: 20 },
  { Icon: Settings, x: "75%", y: "80%", delay: 2, size: 16 },
  { Icon: Workflow, x: "20%", y: "85%", delay: 2.5, size: 18 },
];

const stars = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}));


export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-foreground"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating n8n-style node icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }) => (
        <motion.div
          key={`${x}-${y}`}
          className="absolute"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay }}
        >
          <motion.div
            className="p-3 rounded-xl glassmorphism"
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="text-primary" size={size} />
          </motion.div>
        </motion.div>
      ))}


      {/* Ambient gradient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(300 60% 50%) 0%, transparent 70%)",
          left: "20%",
          top: "30%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(15 90% 60%) 0%, transparent 70%)",
          right: "15%",
          bottom: "20%",
          transform: "translate(50%, 50%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

"use client";

import Form from "@/pageComponents/Form";
import { motion } from "framer-motion";

const AuthPage: React.FC = () => {
  const horizontalLines = [20, 50, 80];
  const verticalLines = [25, 70];

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black px-4 overflow-hidden">
      {/* Neon-lit rays */}
      {horizontalLines.map((percent, idx) => (
        <motion.div
          key={`h-${idx}`}
          className="absolute left-0 w-full h-px bg-gradient-to-r from-cyan-400 to-transparent opacity-60"
          style={{ top: `calc(${percent}% - 1px)` }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            repeat: Infinity,
            duration: 6 + idx * 2,
            ease: "linear",
          }}
        />
      ))}
      {verticalLines.map((percent, idx) => (
        <motion.div
          key={`v-${idx}`}
          className="absolute top-0 h-full w-px bg-gradient-to-b from-purple-400 to-transparent opacity-60"
          style={{ left: `calc(${percent}% - 1px)` }}
          animate={{ y: ["-100%", "100%"] }}
          transition={{
            repeat: Infinity,
            duration: 7 + idx * 2,
            ease: "linear",
          }}
        />
      ))}
      <Form />
    </div>
  );
};

export default AuthPage;

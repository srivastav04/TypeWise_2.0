import React from "react";
import { useMutation } from "@tanstack/react-query";
import { handleData } from "@/apiFunctions";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TypingResultsProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  elapsed: number;
  restartTest: () => void;
}

export default function TypingResults({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  elapsed,
  restartTest,
}: TypingResultsProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => handleData({ wpm, accuracy }),
    onSuccess() {
      console.log("successful");
    },
    onError(error) {
      console.log(error);
    },
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="mt-4 w-full p-5 rounded-2xl
             bg-white/6 backdrop-blur-md border border-white/10
             shadow-lg shadow-slate-900/30"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Results</h3>
          <p className="text-sm text-gray-400">Summary of your last run</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* WPM */}
        <div className="p-3 rounded-xl bg-white/3 border border-white/6">
          <div className="text-xs text-gray-400">WPM</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {wpm.toFixed(2)}
            </span>
            <span className="text-sm text-gray-300">words/min</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-3 rounded-xl bg-white/3 border border-white/6">
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>Accuracy</span>
            <span className="text-sm text-gray-300">
              {accuracy.toFixed(2)}%
            </span>
          </div>

          <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, Number(accuracy)))}%`,
              }}
            />
          </div>
        </div>

        {/* Correct chars */}
        <div className="p-3 rounded-xl bg-white/3 border border-white/6">
          <div className="text-xs text-gray-400">Correct</div>
          <div className="mt-1 text-lg font-semibold text-emerald-300">
            {correctChars}
          </div>
          <div className="text-xs text-gray-400 mt-1">characters</div>
        </div>

        {/* Incorrect chars */}
        <div className="p-3 rounded-xl bg-white/3 border border-white/6">
          <div className="text-xs text-gray-400">Incorrect</div>
          <div className="mt-1 text-lg font-semibold text-rose-400">
            {incorrectChars}
          </div>
          <div className="text-xs text-gray-400 mt-1">characters</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400">Elapsed</div>
          <div className="text-sm font-medium text-gray-100">
            {elapsed.toFixed(2)}s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              restartTest();
              mutateAsync();
            }}
            className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium shadow-sm shadow-cyan-500/20 transition-all"
          >
            Restart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

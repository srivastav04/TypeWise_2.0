import React from "react";

interface TypingStatsProps {
  wpm: number;
  accuracy: number;
  elapsed: number;
  running: boolean;
  finished: boolean;
  startTest: () => void;
  restartTest: () => void;
}

export default function TypingStats({
  wpm,
  accuracy,
  elapsed,
  running,
  finished,
  startTest,
  restartTest,
}: TypingStatsProps) {
  return (
    <div className="mb-4 flex">
      <div className="flex gap-3 items-center">
        <div className="text-sm">
          <div>
            <span className="font-mono text-xl">{elapsed.toFixed(0)}s</span>
          </div>
        </div>
        <div>
          {!running && !finished ? (
            <button
              onClick={startTest}
              className="px-3 py-1 text-lg rounded-2xl  bg-cyan-500 hover:bg-cyan-400 "
            >
              Start
            </button>
          ) : (
            <>
              {running && !finished ? (
                <button
                  onClick={restartTest}
                  className="px-3 py-1 text-lg rounded-2xl  bg-cyan-500 hover:bg-cyan-400 "
                >
                  Restart
                </button>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import TypingStats from "./TypingStats";
import TypingArea from "./TypingArea";
import TypingResults from "./TypingResults";
import { motion, AnimatePresence } from "framer-motion";
import { tests } from "@/lib/tests";

type Mode = { duration: number } | { chars: number };

interface TypingTestProps {
  mode?: Mode;
  onFinish?: (stats: {
    wpm: number;
    accuracy: number;
    elapsed: number;
    correctChars: number;
    incorrectChars: number;
  }) => void;
}

const DEFAULT_TEXT = tests[Math.floor(Math.random() * tests.length)];

function calculateWPM(correctChars: number, elapsedSeconds: number) {
  if (elapsedSeconds <= 0) return 0;
  const num = Number((correctChars / 5 / (elapsedSeconds / 60)).toFixed(1));
  return num;
}

export default function TypingTest({
  mode: initialMode = { duration: 15 },
  onFinish,
}: TypingTestProps) {
  const [currentText, setCurrentText] = useState(
    tests[Math.floor(Math.random() * tests.length)]
  );
  const fullText = useMemo(() => currentText.trim(), [currentText]);
  const chars = useMemo(() => fullText.split(""), [fullText]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [customTime, setCustomTime] = useState<number>(20); // confirmed custom
  const [timeSelection, setTimeSelection] = useState<string>("15"); // always string
  const [pendingCustomTime, setPendingCustomTime] = useState<number>(20);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [position, setPosition] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [correctness, setCorrectness] = useState<boolean[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const correctChars = correctness.filter(Boolean).length;
  const incorrectChars = correctness.filter((v) => v === false).length;
  const wpm = calculateWPM(correctChars, elapsed);
  const accuracy =
    typed.length === 0
      ? 100
      : Number(((correctChars / typed.length) * 100).toFixed(1));

  let lastIndex = -1;

  function getRandomText() {
    let index;
    do {
      index = Math.floor(Math.random() * tests.length);
    } while (index === lastIndex);
    lastIndex = index;
    return tests[index];
  }

  // Timer
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!startedAt) return;
      const sec = (Date.now() - startedAt) / 1000;
      setElapsed(Number(sec.toFixed(2)));

      if ("duration" in mode && sec >= mode.duration)
        return finishTest(mode.duration);
      if ("chars" in mode && position >= mode.chars) return finishTest(sec);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, startedAt, position, mode]);

  function startTest() {
    setPosition(0);
    setTyped([]);
    setCorrectness([]);
    setStartedAt(Date.now());
    setElapsed(0);
    setRunning(true);
    setFinished(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function finishTest(secs?: number) {
    setRunning(false);
    setFinished(true);
    if (secs !== undefined) setElapsed(Number(secs.toFixed(2)));
    onFinish?.({
      wpm: Number(wpm.toFixed(2)),
      accuracy: Number(accuracy.toFixed(2)),
      elapsed,
      correctChars,
      incorrectChars,
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const prevLen = typed.length;
    const newLen = value.length;

    if (newLen < prevLen) {
      setTyped((t) => t.slice(0, newLen));
      setCorrectness((c) => c.slice(0, newLen));
      setPosition(newLen);
      return;
    }

    const newChars = value.slice(prevLen).split("");
    const nextTyped = [...typed];
    const nextCorrectness = [...correctness];

    newChars.forEach((ch) => {
      const expected = chars[position] ?? "";
      nextTyped.push(ch);
      nextCorrectness.push(ch === expected);
      setPosition((p) => p + 1);
    });

    setTyped(nextTyped);
    setCorrectness(nextCorrectness);

    if (!running && nextTyped.length > 0) {
      setStartedAt(Date.now());
      setRunning(true);
    }

    if ("chars" in mode && nextTyped.length >= mode.chars) {
      finishTest((Date.now() - (startedAt ?? Date.now())) / 1000);
    } else if (nextTyped.length >= chars.length) {
      finishTest((Date.now() - (startedAt ?? Date.now())) / 1000);
    }
  }

  function handleRestart() {
    setCurrentText(getRandomText);
    setPosition(0);
    setTyped([]);
    setCorrectness([]);
    setStartedAt(null);
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  }

  // Dropdown handler
  function handleTimeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setTimeSelection(value);
    if (value !== "custom") {
      setMode({ duration: Number(value) });
    }
  }

  // pending custom input change
  function handleCustomInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPendingCustomTime(Number(e.target.value));
  }

  // confirm custom -> set as current selection and mode
  function confirmCustomTime() {
    const val = Math.round(pendingCustomTime);
    if (isNaN(val) || val < 5 || val > 200) return; // validation
    setCustomTime(val);
    setPendingCustomTime(val);
    setTimeSelection(String(val)); // important: select will match an <option>
    setMode({ duration: val });
    handleRestart(); // restart with new time
  }

  // helper to check if a value matches base options
  const baseOptions = ["15", "30", "60"];

  return (
    <div className="min-h-screen w-auto flex justify-center items-center bg-black text-white relative overflow-auto">
      <div className="p-6 ">
        <div
          className={`mb-4 flex items-center ${
            !running ? "justify-between" : "justify-end"
          }`}
        >
          {!running && (
            <>
              <div className="flex items-center gap-4 mb-4  rounded-2xl">
                {/* preset buttons group */}
                <div role="group" aria-label="Timer presets" className="flex">
                  {["15", "30", "60"].map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleTimeChange({ target: { value: time } } as any)
                      }
                      aria-pressed={timeSelection === time}
                      className={`relative flex items-center px-4 py-1.5 text-lg font-medium transition-all duration-150 border
          ${
            timeSelection === time
              ? "mx-2 bg-cyan-500 hover:bg-cyan-400 rounded-2xl text-white border-none "
              : "mx-2 bg-transparent border-none text-gray-300  hover:bg-gray-700 hover:border-gray-600 hover:rounded-2xl"
          }`}
                    >
                      {/* small current-state indicator */}
                      {timeSelection === time && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/10">
                          ✓
                        </span>
                      )}
                      <span className="min-w-[34px] text-center">{time}s</span>
                    </motion.button>
                  ))}

                  {/* dynamic custom option (if present) */}
                  {!baseOptions.includes(String(customTime)) && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        handleTimeChange({
                          target: { value: String(customTime) },
                        } as any)
                      }
                      aria-pressed={timeSelection === String(customTime)}
                      className={`flex items-center px-4 py-1.5 text-lg font-medium transition-all duration-150 border
          ${
            timeSelection === String(customTime)
              ? "bg-cyan-500 hover:bg-cyan-400 rounded-2xl text-white border-none "
              : "border-none text-gray-300  hover:bg-gray-700 hover:border-gray-600 hover:rounded-2xl"
          }`}
                    >
                      {timeSelection === String(customTime) && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs bg-white/10">
                          ✓
                        </span>
                      )}
                      <span className="min-w-[46px] text-center">
                        {customTime}s
                      </span>
                    </motion.button>
                  )}

                  {/* custom button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      handleTimeChange({ target: { value: "custom" } } as any)
                    }
                    aria-pressed={timeSelection === "custom"}
                    className={`flex items-center px-4 py-1.5  text-lg font-medium transition-all duration-150 border
        ${
          timeSelection === "custom"
            ? "mx-2 bg-cyan-500 hover:bg-cyan-400 rounded-2xl text-white "
            : "mx-2 border-none text-gray-300  hover:bg-gray-700 hover:border-gray-600 hover:rounded-2xl"
        }`}
                  >
                    {timeSelection === "custom" && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/10">
                        ✓
                      </span>
                    )}
                    <span className="min-w-[56px] text-center">Custom</span>
                  </motion.button>
                </div>

                {/* custom input panel (animated in/out) */}
                <AnimatePresence>
                  {timeSelection === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="text"
                        min={5}
                        max={600}
                        value={pendingCustomTime}
                        onChange={handleCustomInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            confirmCustomTime();
                          }
                        }}
                        className="w-28 bg-gray-800 border  rounded-lg px-3 py-2 text-lg text-gray-200
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-shadow duration-150"
                      />
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={confirmCustomTime}
                        className="bg-cyan-500 hover:bg-cyan-400 px-4 py-1.5 rounded-lg text-white text-lg font-medium shadow-sm shadow-blue-500/20 transition-all"
                      >
                        Set
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          <TypingStats
            wpm={wpm}
            accuracy={accuracy}
            elapsed={elapsed}
            running={running}
            finished={finished}
            startTest={startTest}
            restartTest={handleRestart}
          />
        </div>

        {finished ? (
          <TypingResults
            wpm={wpm}
            accuracy={accuracy}
            correctChars={correctChars}
            incorrectChars={incorrectChars}
            elapsed={elapsed}
            restartTest={handleRestart}
          />
        ) : (
          <TypingArea
            chars={chars}
            position={position}
            typed={typed}
            correctness={correctness}
            inputRef={inputRef}
            running={running}
            finished={finished}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
}

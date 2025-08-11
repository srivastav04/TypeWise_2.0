// components/TypingTest.tsx

import TypingTest from "@/pageComponents/TypingTest";
import NavBar from "@/pageComponents/NavBar";

/*
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Mode = { duration: number } | { chars: number };

interface TypingTestProps {
  /** text to type; if omitted, a default passage is used 
  text?: string;
  /** either timed mode ({ duration: seconds }) or chars mode ({ chars: count }) 
  mode?: Mode;
  /** optional callback when test finishes 
  onFinish?: (stats: {
    wpm: number;
    accuracy: number;
    elapsed: number;
    correctChars: number;
    incorrectChars: number;
  }) => void;
}

const DEFAULT_TEXT = `The quick brown fox jumps over the lazy dog. Type accurately and quickly.`;

function calculateWPM(correctChars: number, elapsedSeconds: number) {
  // Standard WPM: (correct characters / 5) / minutes
  if (elapsedSeconds <= 0) return 0;
  return correctChars / 5 / (elapsedSeconds / 60);
}

export default function TypingTest({
  text = DEFAULT_TEXT,
  mode = { duration: 60 },
  onFinish,
}: TypingTestProps) {
  const fullText = useMemo(() => text.trim(), [text]);
  const chars = useMemo(() => fullText.split(""), [fullText]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [position, setPosition] = useState(0); // index of next char to type
  const [typed, setTyped] = useState<string[]>([]); // user input chars
  const [correctness, setCorrectness] = useState<boolean[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  // Derived stats
  const correctChars = correctness.filter(Boolean).length;
  const incorrectChars = correctness.filter((v) => v === false).length;
  const wpm = calculateWPM(correctChars, elapsed);
  const accuracy =
    typed.length === 0 ? 100 : (correctChars / typed.length) * 100;

  // Timer for timed mode
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      if (!startedAt) return;
      const now = Date.now();
      const sec = (now - startedAt) / 1000;
      setElapsed(Number(sec.toFixed(2)));

      // finish conditions:
      if ("duration" in mode && sec >= mode.duration) {
        finishTest(mode.duration);
        return;
      }
      if ("chars" in mode && position >= mode.chars) {
        finishTest(sec);
        return;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, startedAt, position, mode]);

  // focus input on container click
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onClick = () => inputRef.current?.focus();
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, []);

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
    if (secs !== undefined)
      setElapsed(Number(secs.toFixed ? secs.toFixed(2) : secs));
    if (onFinish) {
      onFinish({
        wpm: Number(wpm.toFixed(2)),
        accuracy: Number(accuracy.toFixed(2)),
        elapsed,
        correctChars,
        incorrectChars,
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (finished) {
      e.preventDefault();
      return;
    }
    // Prevent default for space to keep consistent behavior
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // We only care about new input after previous length
    const prevLen = typed.length;
    const newLen = value.length;

    // If user pasted or deleted: support backspace by comparing lengths
    if (newLen < prevLen) {
      // Backspace: remove last char
      setTyped((t) => t.slice(0, newLen));
      setCorrectness((c) => c.slice(0, newLen));
      setPosition(newLen);
      return;
    }

    // New chars typed
    const newChars = value.slice(prevLen).split("");
    const nextTyped = [...typed];
    const nextCorrectness = [...correctness];

    newChars.forEach((ch) => {
      const expected = chars[position] ?? "";
      const isCorrect = ch === expected;
      nextTyped.push(ch);
      nextCorrectness.push(isCorrect);
      setPosition((p) => p + 1);
    });

    setTyped(nextTyped);
    setCorrectness(nextCorrectness);

    // start timer on first keypress
    if (!running && nextTyped.length > 0) {
      setStartedAt(Date.now());
      setRunning(true);
    }

    // finish if typed whole text in chars mode or full text
    if ("chars" in mode && nextTyped.length >= mode.chars) {
      finishTest((Date.now() - (startedAt ?? Date.now())) / 1000);
    } else if (nextTyped.length >= chars.length) {
      finishTest((Date.now() - (startedAt ?? Date.now())) / 1000);
    }
  }

  function handleRestart() {
    setPosition(0);
    setTyped([]);
    setCorrectness([]);
    setStartedAt(null);
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    inputRef.current && (inputRef.current.value = "");
    inputRef.current?.focus();
  }

  // Render character with styling
  function renderChar(c: string, i: number) {
    const typedChar = typed[i];
    const isCurrent = i === position;
    const isTyped = i < typed.length;

    const base = "px-0.5 py-0.5 rounded-sm";
    if (!isTyped && !isCurrent)
      return (
        <span key={i} className={`${base} text-gray-300`}>
          {c === " " ? "·" : c}
        </span>
      );

    if (isCurrent) {
      return (
        <span
          key={i}
          className={`${base} underline decoration-2 decoration-yellow-400`}
        >
          {c === " " ? "·" : c}
        </span>
      );
    }

    // typed
    const correct = correctness[i];
    return (
      <span
        key={i}
        className={`${base} ${
          correct ? "text-green-300" : "text-red-400 line-through"
        }`}
      >
        {typedChar === " " ? "·" : typedChar}
      </span>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Typing Test</h2>
        <div className="flex gap-3 items-center">
          <div className="text-sm">
            <div>
              WPM: <span className="font-mono">{Number(wpm.toFixed(0))}</span>
            </div>
            <div>
              Accuracy:{" "}
              <span className="font-mono">{Number(accuracy.toFixed(0))}%</span>
            </div>
            <div>
              Time: <span className="font-mono">{elapsed.toFixed(0)}s</span>
            </div>
          </div>
          <div>
            {!running && !finished ? (
              <button
                onClick={startTest}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
              >
                Start
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
              >
                Restart
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-gray-900 p-4 rounded-lg min-h-[120px] focus:outline-none cursor-text"
        aria-label="Typing area"
        role="textbox"
        tabIndex={0}
      >
        <div className="leading-7 text-lg break-words flex flex-wrap">
          {chars.map((c, i) => renderChar(c, i))}
        </div>
      </div>

      {/* invisible input to capture keys }
      <input
        ref={inputRef}
        aria-hidden={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className="opacity-0 absolute left-0 -z-10"
      />

      <div className="mt-4 text-sm text-gray-300">
        <p>
          Tip: Click the text area and start typing. Spaces are shown as "·".
          The test supports backspace.
        </p>
      </div>

      {finished && (
        <div className="mt-4 p-3 bg-gray-800 rounded">
          <h3 className="font-semibold">Results</h3>
          <p>WPM: {Number(wpm.toFixed(2))}</p>
          <p>Accuracy: {Number(accuracy.toFixed(2))}%</p>
          <p>Correct characters: {correctChars}</p>
          <p>Incorrect characters: {incorrectChars}</p>
          <p>Elapsed: {elapsed.toFixed(2)}s</p>
        </div>
      )}
    </div>
  );
}
*/

export default function Home() {
  return (
    <>
      <NavBar />
      <TypingTest />
    </>
  );
}

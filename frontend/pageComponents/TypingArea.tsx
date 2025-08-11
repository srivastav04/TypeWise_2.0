import React, { useEffect, useRef } from "react";

interface TypingAreaProps {
  chars: string[];
  position: number;
  typed: string[];
  correctness: boolean[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  running: boolean;
  finished: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TypingArea({
  chars,
  position,
  typed,
  correctness,
  inputRef,
  running,
  finished,
  onChange,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onClick = () => inputRef.current?.focus();
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [inputRef]);

  function renderChar(c: string, i: number) {
    const typedChar = typed[i];
    const isCurrent = i === position;
    const isTyped = i < typed.length;
    const base =
      "inline-block w-[1ch] h-[1.5em] px-0.5 rounded-sm align-middle font-mono text-center";

    if (!isTyped && !isCurrent) {
      return (
        <span key={i} className={`${base} text-gray-500`}>
          {c === " " ? " " : c}
        </span>
      );
    }

    if (isCurrent) {
      return (
        <span
          key={i}
          className={`${base} underline decoration-2 decoration-white text-gray-500`}
        >
          {c === " " ? " " : c}
        </span>
      );
    }

    return (
      <span
        key={i}
        className={`${base} ${correctness[i] ? "text-white" : "text-red-500"}`}
        style={{
          textDecoration: correctness[i] ? "none" : "line-through",
          textDecorationThickness: correctness[i] ? undefined : "2px",
        }}
      >
        {typedChar === " " ? " " : typedChar}
      </span>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="text-xl sm:text-3xl tracking-wide flex flex-wrap mt-6 whitespace-pre font-mono leading-[1.5em]"
        aria-label="Typing area"
        role="textbox"
        tabIndex={0}
      >
        {chars.map((c, i) => renderChar(c, i))}
      </div>

      <input
        ref={inputRef}
        aria-hidden={false}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={onChange}
        disabled={finished}
        className="opacity-0 absolute left-0 -z-10"
      />
    </>
  );
}

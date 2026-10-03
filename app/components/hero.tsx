"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LEFT_LINE = "READY TO WAKE UP?";
const RIGHT_LINE = "KEEP SCROLLING";

function ScrollSign({ shown }: { shown: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}
    >
      <span
        className="font-matrix text-[0.72rem] tracking-[0.58em] text-[#00ff41]"
        style={{ textShadow: "0 0 12px rgba(0, 255, 65, 0.9)" }}
      >
        SCROLL
      </span>
      <span className="flex flex-col items-center gap-1">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="matrix-chevron block"
            style={{ animationDelay: `${index * 160}ms` }}
          >
            <span className="block h-2.5 w-2.5 rotate-45 border-r-2 border-b-2 border-[#00ff41]" />
          </span>
        ))}
      </span>
    </div>
  );
}

function TypedLine({ text, count }: { text: string; count: number }) {
  const visible = text.slice(0, count);
  const typing = count > 0 && count < text.length;

  return (
    <p
      className="min-h-[1.1em] text-center font-matrix text-[clamp(1.7rem,7vw,100px)] leading-none font-bold tracking-[0.06em] whitespace-nowrap text-[#00ff41] uppercase"
      style={{
        fontSynthesis: "weight",
        WebkitTextStroke: "1.5px #00ff41",
        paintOrder: "stroke fill",
        textShadow:
          "0 0 12px rgba(0, 255, 65, 0.95), 0 0 36px rgba(0, 255, 65, 0.7), 0 0 72px rgba(0, 255, 65, 0.4)",
      }}
    >
      {visible}
      {typing ? <span className="holo-caret text-[#00ff41]">▍</span> : null}
    </p>
  );
}

export default function Hero() {
  const [revealed, setRevealed] = useState(false);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [phase, setPhase] = useState<"reveal" | "left" | "right" | "done">(
    "reveal",
  );

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setRevealed(true);
      setLeftCount(LEFT_LINE.length);
      setRightCount(RIGHT_LINE.length);
      setPhase("done");
      return;
    }

    const open = window.setTimeout(() => setRevealed(true), 80);
    const type = window.setTimeout(() => setPhase("left"), 80 + 1400 + 280);

    return () => {
      window.clearTimeout(open);
      window.clearTimeout(type);
    };
  }, []);

  useEffect(() => {
    if (phase !== "left") return;
    if (leftCount >= LEFT_LINE.length) {
      const pause = window.setTimeout(() => setPhase("right"), 420);
      return () => window.clearTimeout(pause);
    }
    const tick = window.setTimeout(
      () => setLeftCount((count) => count + 1),
      68,
    );
    return () => window.clearTimeout(tick);
  }, [phase, leftCount]);

  useEffect(() => {
    if (phase !== "right") return;
    if (rightCount >= RIGHT_LINE.length) {
      setPhase("done");
      return;
    }
    const tick = window.setTimeout(
      () => setRightCount((count) => count + 1),
      68,
    );
    return () => window.clearTimeout(tick);
  }, [phase, rightCount]);

  return (
    <section className="relative h-screen overflow-hidden bg-transparent">
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 58%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, #000 58%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0 transition-[clip-path,transform,filter] duration-[1400ms] ease-[cubic-bezier(0.77,0,0.18,1)]"
          style={{
            clipPath: revealed ? "inset(0 0 0 0)" : "inset(0 50% 0 50%)",
            transform: revealed ? "scale(1)" : "scale(1.08)",
            filter: revealed ? "brightness(1)" : "brightness(1.6)",
          }}
        >
          <Image
            src="/hero%20sec%20image 2.jpg"
            alt="A face split by glass in a green digital city"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_18%] opacity-20"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 0px, rgba(0, 0, 0, 0.22) 1px, transparent 2px, transparent 5px)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[14%] z-10 flex flex-col items-center gap-5 px-6">
        <TypedLine text={LEFT_LINE} count={leftCount} />
        <TypedLine text={RIGHT_LINE} count={rightCount} />
      </div>
      <ScrollSign shown={phase === "done"} />
    </section>
  );
}

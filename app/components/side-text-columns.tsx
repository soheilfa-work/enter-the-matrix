"use client";

import Image from "next/image";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

const PHRASE = "THE /MATRIX/SYSTEM IS ONLINE  ";
const COPIES = 2;
const PHRASES_PER_COPY = 3;
const SCROLL_SCREENS = 10;

const COLUMNS = [
  {
    color: "#00ff41",
    glow: "0 0 14px rgba(0, 255, 65, 0.85)",
    direction: "up",
    phase: 0.02,
  },
  {
    color: "#0b7a32",
    glow: "0 0 8px rgba(11, 122, 50, 0.7)",
    direction: "down",
    phase: 0.37,
  },
  {
    color: "#00ff41",
    glow: "0 0 14px rgba(0, 255, 65, 0.85)",
    direction: "up",
    phase: 0.16,
  },
  {
    color: "#0b7a32",
    glow: "0 0 8px rgba(11, 122, 50, 0.7)",
    direction: "down",
    phase: 0.54,
  },
  {
    color: "#00ff41",
    glow: "0 0 14px rgba(0, 255, 65, 0.85)",
    direction: "up",
    phase: 0.28,
  },
] as const;

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFZ";

const BARS = [
  {
    src: "/images/01.jpg",
    grow: 1.2,
    length: 0.92,
    parallax: 14,
    start: 0.0,
    end: 0.78,
    focus: "center 40%",
  },
  {
    src: "/images/02.jpg",
    grow: 1.55,
    length: 1,
    parallax: 10,
    start: 0.04,
    end: 0.74,
    focus: "center 40%",
  },
  {
    src: "/images/03.jpg",
    grow: 1.05,
    length: 0.62,
    parallax: 22,
    start: 0.1,
    end: 0.96,
    focus: "center 40%",
  },
  {
    src: "/images/04.jpg",
    grow: 1.4,
    length: 0.84,
    parallax: 16,
    start: 0.02,
    end: 0.86,
    focus: "center 40%",
  },
  {
    src: "/images/05.jpg",
    grow: 1.15,
    length: 0.72,
    parallax: 18,
    start: 0.08,
    end: 1,
    focus: "center 40%",
  },
] as const;

function wrap(value: number, size: number) {
  if (size <= 0) return 0;
  return ((value % size) + size) % size;
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export default function SideTextColumns() {
  const sectionRef = useRef<HTMLElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);
  const photoRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
    });

    const update = (scroll: number) => {
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled = Math.min(
        Math.max(scroll - section.offsetTop, 0),
        scrollable,
      );
      const progress = scrolled / scrollable;

      trackRefs.current.forEach((track, index) => {
        if (!track) return;
        const copy = track.firstElementChild;
        if (!(copy instanceof HTMLElement)) return;

        const loop = copy.offsetHeight;
        if (loop <= 0) return;

        const column = COLUMNS[index];
        const shifted = wrap(column.phase * loop + progress * loop, loop);
        const y = column.direction === "up" ? -shifted : -loop + shifted;
        track.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      barRefs.current.forEach((bar, index) => {
        if (!bar) return;
        const spec = BARS[index];
        const span = spec.end - spec.start;
        const t = span <= 0 ? 1 : (progress - spec.start) / span;
        const eased = smoothstep(t);
        bar.style.transform = `translate3d(${(1 - eased) * -100}%, 0, 0)`;
      });

      photoRefs.current.forEach((photo, index) => {
        if (!photo) return;
        const drift = (1 - progress) * BARS[index].parallax;
        photo.style.transform = `translate3d(${-drift}%, 0, 0)`;
      });
    };

    update(lenis.animatedScroll);
    const unsubscribe = lenis.on("scroll", (instance) => {
      update(instance.animatedScroll);
    });

    const onResize = () => {
      lenis.resize();
      update(lenis.animatedScroll);
    };

    let alive = true;
    window.addEventListener("resize", onResize);
    document.fonts.ready.then(() => {
      if (alive) onResize();
    });

    return () => {
      alive = false;
      unsubscribe();
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const canvas = rainRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const fontSize = 16;
    let width = 0;
    let height = 0;
    let drops: number[] = [];

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
      const columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };

    resize();

    let frame = 0;
    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.12)";
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px ${getComputedStyle(document.body).fontFamily}`;

      for (let index = 0; index < drops.length; index++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const head = Math.random() > 0.975;
        context.fillStyle = head ? "#d8ffd8" : "#00ff41";
        context.globalAlpha = head ? 0.32 : 0.05 + Math.random() * 0.08;
        context.fillText(glyph, index * fontSize, drops[index] * fontSize);
        if (drops[index] * fontSize > height && Math.random() > 0.975)
          drops[index] = 0;
        drops[index] += 0.45;
      }

      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const copy = PHRASE.repeat(PHRASES_PER_COPY);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: `${(SCROLL_SCREENS + 1) * 100}vh` }}
    >
      <div
        className="sticky top-0 flex h-screen overflow-hidden bg-black"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
        }}
      >
        <canvas
          ref={rainRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0px, rgba(0, 0, 0, 0.18) 1px, transparent 2px, transparent 4px)",
          }}
        />
        <div
          aria-hidden="true"
          className="relative z-10 flex min-w-0 flex-1 flex-col gap-[0.85vh] py-[0.9vh] pr-[1.6vw]"
        >
          {BARS.map((bar, index) => (
            <div
              key={bar.src}
              className="min-h-0 overflow-hidden"
              style={{ flex: bar.grow }}
            >
              <div
                ref={(node) => {
                  barRefs.current[index] = node;
                }}
                className="relative h-full overflow-hidden will-change-transform"
                style={{
                  width: `${bar.length * 100}%`,
                  transform: "translate3d(-110%, 0, 0)",
                }}
              >
                <div
                  ref={(node) => {
                    photoRefs.current[index] = node;
                  }}
                  className="absolute inset-y-0 left-0 h-full will-change-transform"
                  style={{
                    width: "146%",
                    transform: `translate3d(${-bar.parallax}%, 0, 0)`,
                  }}
                >
                  <Image
                    src={bar.src}
                    alt=""
                    fill
                    priority
                    sizes="70vw"
                    className="object-cover"
                    style={{
                      objectPosition: bar.focus,
                      filter:
                        "grayscale(1) sepia(0.5) hue-rotate(60deg) saturate(3) contrast(1.25) brightness(0.72)",
                    }}
                  />
                </div>
                <div aria-hidden="true" className="bar-trace">
                  <span
                    className="bar-trace-spin"
                    style={{ animationDelay: `${index * -0.7}s` }}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] shadow-[inset_0_0_0_1px_rgba(0,255,65,0.55),inset_0_0_16px_rgba(0,255,65,0.28)]"
                />
              </div>
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative z-20 h-full shrink-0 overflow-hidden"
          style={{
            fontSize: "clamp(4.5rem, 8.2vw, 9rem)",
            width: "4.05em",
          }}
        >
          <div className="flex h-full" style={{ marginRight: "-0.5em" }}>
            {COLUMNS.map((column, index) => (
              <div
                key={index}
                className="relative h-full shrink-0 overflow-hidden"
                style={{ width: "0.9em" }}
              >
                <div
                  ref={(node) => {
                    trackRefs.current[index] = node;
                  }}
                  className="absolute top-0 left-0 will-change-transform"
                >
                  {Array.from({ length: COPIES }, (_, copyIndex) => (
                    <span
                      key={copyIndex}
                      className="block whitespace-nowrap font-matrix uppercase leading-[0.9] tracking-[0.04em] [text-orientation:mixed] [writing-mode:vertical-rl]"
                      style={{ color: column.color, textShadow: column.glow }}
                    >
                      {copy}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

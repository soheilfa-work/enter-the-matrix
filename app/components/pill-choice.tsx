"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const QUESTION = "RED PILL OR BLUE PILL?";
const HANDS_SRC = "/images/pills-hologram.jpg";

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function span(progress: number, start: number, end: number) {
  return smoothstep((progress - start) / (end - start));
}

function keyOutBlack(src: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        reject(new Error("canvas"));
        return;
      }

      context.drawImage(image, 0, 0);
      const frame = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = frame.data;

      for (let index = 0; index < pixels.length; index += 4) {
        const level = Math.max(
          pixels[index],
          pixels[index + 1],
          pixels[index + 2],
        );
        const fade = smoothstep((level - 14) / 42);
        pixels[index + 3] = Math.round(fade * pixels[index + 3]);
      }

      context.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}

export default function PillChoice() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [handsSrc, setHandsSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    keyOutBlack(HANDS_SRC)
      .then((url) => {
        if (!cancelled) setHandsSrc(url);
      })
      .catch(() => {
        if (!cancelled) setHandsSrc(HANDS_SRC);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const placeHand = (
      node: HTMLDivElement | null,
      amount: number,
      side: "left" | "right",
    ) => {
      if (!node) return;
      const edge = (1 - amount) * 120;
      node.style.opacity = String(smoothstep(Math.min(1, amount / 0.22)));
      node.style.transform = `translate3d(0, ${(1 - amount) * 28}px, 0)`;
      node.style.clipPath =
        side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)";

      const photo = node.querySelector("img");
      if (!(photo instanceof HTMLElement)) return;
      const mask = `linear-gradient(to bottom, transparent ${edge - 22}%, #000 ${edge}%)`;
      photo.style.webkitMaskImage = mask;
      photo.style.maskImage = mask;
    };

    const update = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-section.getBoundingClientRect().top, 0),
        Math.max(scrollable, 0),
      );
      const progress = scrollable > 0 ? scrolled / scrollable : 1;

      placeHand(leftRef.current, span(progress, 0.02, 0.4), "left");
      placeHand(rightRef.current, span(progress, 0.42, 0.8), "right");

      if (textRef.current) {
        const reveal = span(progress, 0.72, 1);
        textRef.current.style.clipPath = `inset(0 ${(1 - reveal) * 100}% 0 0)`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [handsSrc]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{ height: "280vh" }}
    >
      <div
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-black"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 18%, #000 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 18%, #000 100%)",
        }}
      >
        <Image
          src="/morpheus%20background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none scale-110 object-cover opacity-20 blur-xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 255, 65, 0.14), transparent 62%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 0px, rgba(0, 0, 0, 0.16) 1px, transparent 2px, transparent 4px)",
          }}
        />

        <div className="relative z-10 w-[min(1080px,92vw)]">
          {/* <div className="pointer-events-none absolute -inset-3 border border-[#00ff41]/35">
            <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-[#00ff41]" />
            <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-[#00ff41]" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-[#00ff41]" />
            <span className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-[#00ff41]" />
          </div> */}

          <p className="mb-4 px-2 font-matrix text-xs tracking-[0.45em] text-[#00ff41]/80">
            SYS://CHOICE
          </p>

          <div className="relative aspect-video">
            <div
              ref={leftRef}
              className="absolute inset-0 will-change-transform"
              style={{ clipPath: "inset(0 50% 0 0)", opacity: 0 }}
            >
              {handsSrc ? (
                <img
                  src={handsSrc}
                  alt="A holographic hand holding a red pill"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 98%, #000 120%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 98%, #000 120%)",
                  }}
                />
              ) : null}
            </div>
            <div
              ref={rightRef}
              className="absolute inset-0 will-change-transform"
              style={{ clipPath: "inset(0 0 0 50%)", opacity: 0 }}
            >
              {handsSrc ? (
                <img
                  src={handsSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent 98%, #000 120%)",
                    maskImage:
                      "linear-gradient(to bottom, transparent 98%, #000 120%)",
                  }}
                />
              ) : null}
            </div>
            {/* <div className="holo-scan pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-[#00ff41]/25 to-transparent" /> */}
          </div>

          <div className="mt-6 overflow-hidden px-2">
            <p
              ref={textRef}
              className="font-matrix text-[clamp(1.6rem,4.6vw,3.4rem)] leading-none tracking-[0.12em] text-[#00ff41] text-center uppercase"
              style={{
                clipPath: "inset(0 100% 0 0)",
                textShadow: "0 0 16px rgba(0, 255, 65, 0.85)",
              }}
            >
              {QUESTION}
              <span className="holo-caret ml-2 inline-block">_</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

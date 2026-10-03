# The Matrix

A full-screen scrolling page: a hero that types itself, photo bands that slide in beside falling code, and a last screen where two hands offer the pills.

## Live demo

https://enter-the-matrix-3i93.vercel.app/

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Scroll through the whole page. The middle section is about ten screens tall.

## What you see

1. **Hero.** The portrait opens from the center. Then two lines type in glowing green: `READY TO WAKE UP?` and `KEEP SCROLLING`. A green `SCROLL` cue drops in after the typing finishes.
2. **Columns.** White columns of `THE /MATRIX/SYSTEM IS ONLINE` move up, dim columns move down, and both loop. Five photos slide in from the left at different lengths, with a green glow traveling around each frame. The top and bottom of this section fade out.
3. **The choice.** A blurred background sits behind the frame. The red-pill hand appears first, then the blue-pill hand, then `RED PILL OR BLUE PILL?`.

## Stack

- [Next.js](https://nextjs.org) 16
- React 19
- Tailwind CSS 4
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling

## Scripts

```bash
npm run dev    # local demo
npm run build  # production build
npm run start  # serve the production build
npm run lint
```

Images live in `public/`. Replacing a file with the same name shows up on the next load.

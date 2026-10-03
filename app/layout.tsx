import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const matrix = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-matrix-face",
});

export const metadata: Metadata = {
  title: "The Matrix",
  description: "Vertical matrix text and images that move with scroll",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${matrix.variable} antialiased`}
    >
      <body className="bg-black text-[#00ff41]">{children}</body>
    </html>
  );
}

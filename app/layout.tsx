import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// DejaVu Sans, subset to Hebrew + Latin (see ADR-2 in spec/ARCHITECTURE.md)
const dejavu = localFont({
  src: [
    { path: "./fonts/DejaVuSans.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DejaVuSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-dejavu",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "בדיחה בקליק",
  description: "בדיחה בעברית על כל נושא, בלחיצה אחת",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF801",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={dejavu.variable}>
      <body>{children}</body>
    </html>
  );
}

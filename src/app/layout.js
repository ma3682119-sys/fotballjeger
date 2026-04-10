import { DM_Sans, DM_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Fotballjeger — Career OS",
  description: "Football career intelligence system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${newsreader.variable}`}>
      <body className="h-screen overflow-hidden bg-bg text-txt antialiased font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}

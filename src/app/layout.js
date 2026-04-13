import { DM_Sans, DM_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Inline script — runs before paint to prevent theme flash
const THEME_SCRIPT = `
(function(){
  try {
    var LS = localStorage;
    var theme = LS.getItem("fotballjeger:theme") || "dark";
    var accent = LS.getItem("fotballjeger:accent") || "orange";
    var raw = parseInt(LS.getItem("fotballjeger:brightness") || "100", 10);
    var br = isFinite(raw) ? Math.min(100, Math.max(70, raw)) : 100;
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.accent = accent;
    root.style.setProperty("--display-brightness", String(br / 100));
    LS.setItem("fotballjeger:theme", theme);
    LS.setItem("fotballjeger:accent", accent);
    LS.setItem("fotballjeger:brightness", String(br));
  } catch(e) {}
})();
`;

export const metadata = {
  title: "Fotballjeger — Career OS",
  description: "Football career intelligence system",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} ${newsreader.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

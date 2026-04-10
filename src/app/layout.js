import { Syne, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Fotballjeger — Career OS",
  description: "Football career intelligence system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-bg text-txt antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[220px] p-8 max-w-[1100px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

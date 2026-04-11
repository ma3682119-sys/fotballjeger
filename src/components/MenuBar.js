"use client";
import { useState, useEffect } from "react";

export default function MenuBar({ focusedApp }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Oslo" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-[36px] flex items-center justify-between px-4 shrink-0 relative z-50"
      style={{
        background: "rgba(34,24,17,0.82)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        borderBottom: "1px solid rgba(242,223,203,0.06)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-5">
        <span className="text-[13px] font-semibold tracking-tight" style={{ color: "var(--color-accent)" }}>
          Fotballjeger
        </span>
        <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--color-text-secondary)" }}>
          <button className="hover:text-[var(--color-text-primary)] transition-colors">
            {focusedApp || "Desktop"}
          </button>
          <button className="hover:text-[var(--color-text-primary)] transition-colors">File</button>
          <button className="hover:text-[var(--color-text-primary)] transition-colors">View</button>
          <button className="hover:text-[var(--color-text-primary)] transition-colors">Window</button>
          <button className="hover:text-[var(--color-text-primary)] transition-colors">Help</button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full" style={{ background: "var(--color-green)", animation: "pulse-dot 2s infinite" }} />
          <span style={{ color: "var(--color-green)", opacity: 0.8, fontSize: "11px" }}>Scanner</span>
        </div>
        <span style={{ color: "var(--color-text-tertiary)", opacity: 0.4 }}>|</span>
        <span>{time} CET</span>
      </div>
    </div>
  );
}

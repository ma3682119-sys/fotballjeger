"use client";
import { useState, useEffect } from "react";

export default function MenuBar({ focusedApp }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-8 bg-[#0d0d12]/90 backdrop-blur-md border-b border-border flex items-center justify-between px-3 z-50 relative shrink-0">
      {/* Left: app menu */}
      <div className="flex items-center gap-4">
        <span className="text-accent font-bold text-sm tracking-tight">◈ Fotballjeger</span>
        <div className="flex items-center gap-3 text-[12px] text-txt2">
          <button className="hover:text-txt transition-colors">{focusedApp || "Desktop"}</button>
          <button className="hover:text-txt transition-colors">File</button>
          <button className="hover:text-txt transition-colors">View</button>
          <button className="hover:text-txt transition-colors">Window</button>
          <button className="hover:text-txt transition-colors">Help</button>
        </div>
      </div>

      {/* Right: status */}
      <div className="flex items-center gap-3 text-[11px] text-txt2 font-[family-name:var(--font-mono)]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green" style={{ animation: "pulse-dot 2s infinite" }} />
          <span className="text-green/80">Scanner</span>
        </div>
        <span className="text-txt3">|</span>
        <span>{time} CET</span>
      </div>
    </div>
  );
}

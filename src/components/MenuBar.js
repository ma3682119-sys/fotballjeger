"use client";
import { useState, useEffect, useRef } from "react";

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ width: 14, height: 14 }}>
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" strokeLinecap="round"/>
    </svg>
  );
}

export default function MenuBar({ focusedApp, onOpenApp }) {
  const [time,    setTime]    = useState("--:--");
  const [showCtrl,setShowCtrl]= useState(false);
  const ctrlRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const d = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Oslo" });
      const t = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Oslo" });
      setTime(`${d}  ${t}`);
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  // Close display panel on outside click
  useEffect(() => {
    if (!showCtrl) return;
    const handler = (e) => {
      if (ctrlRef.current && !ctrlRef.current.contains(e.target)) setShowCtrl(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCtrl]);

  const btnStyle = {
    cursor: "pointer",
    padding: "2px 8px",
    fontSize: 12,
    color: "var(--text-primary)",
    background: "transparent",
    border: "none",
    fontFamily: "var(--font-body)",
    lineHeight: "36px",
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    transition: "background 0.1s",
  };

  return (
    <div
      style={{
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 6px",
        flexShrink: 0,
        position: "relative",
        zIndex: 100,
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--bg-fourth)",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Brand/favicon button */}
        <button
          style={{ ...btnStyle, padding: "2px 6px" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--button-secondary)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16,
            background: "var(--bg-third)",
            border: "1px solid var(--bg-fourth)",
            overflow: "hidden",
          }}>
            <span style={{ fontSize: 10 }}>⚽</span>
          </span>
        </button>

        <button
          style={{ ...btnStyle, fontWeight: 600, color: "var(--text-primary)" }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--button-secondary)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Fotballjeger
        </button>

        {[focusedApp || "Desktop", "File", "View", "Window"].map(item => (
          <button
            key={item}
            style={{ ...btnStyle, fontWeight: 400 }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--button-secondary)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Scanner dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--color-green)",
            animation: "pulse-dot 2s ease-in-out infinite",
          }}/>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-green)", opacity: 0.8, letterSpacing: "0.04em" }}>
            Scanner
          </span>
        </div>

        {/* Display controls button */}
        <div style={{ position: "relative" }} ref={ctrlRef}>
          <button
            onClick={() => setShowCtrl(s => !s)}
            title="Display controls"
            style={{
              ...btnStyle,
              padding: "2px 6px",
              background: showCtrl ? "var(--button-secondary)" : "transparent",
              color: "var(--text-primary)",
              width: 28, height: 28,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={e => { if (!showCtrl) e.currentTarget.style.background = "var(--button-secondary)"; }}
            onMouseLeave={e => { if (!showCtrl) e.currentTarget.style.background = "transparent"; }}
          >
            <SunIcon />
          </button>

          {/* Display controls dropdown */}
          {showCtrl && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: 200,
              background: "var(--bg-secondary)",
              border: "1px solid var(--bg-fourth)",
              zIndex: 200,
              padding: 12,
              boxShadow: "var(--shadow-window-focused)",
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 10 }}>DISPLAY CONTROLS</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>Open Settings for full controls</div>
              <button
                onClick={() => { setShowCtrl(false); onOpenApp?.("settings"); }}
                style={{
                  width: "100%", padding: "7px 0",
                  background: "var(--accent-dim)",
                  border: "1px solid var(--bg-fourth)",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                }}>
                OPEN SETTINGS
              </button>
            </div>
          )}
        </div>

        {/* Time */}
        <time style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          tabularNums: true,
          paddingRight: 4,
        }}>
          {time} CET
        </time>
      </div>
    </div>
  );
}

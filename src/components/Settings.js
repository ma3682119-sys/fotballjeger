"use client";
import { useState, useEffect } from "react";

const THEMES = [
  { id: "dark",  label: "Dark" },
  { id: "light", label: "Light" },
];

const ACCENTS = [
  { id: "orange", color: "#c44010", label: "Orange" },
  { id: "green",  color: "#0e6824", label: "Green" },
  { id: "blue",   color: "#1248a8", label: "Blue" },
  { id: "purple", color: "#510e90", label: "Purple" },
];

function applyToDOM(theme, accent, brightness) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.accent = accent;
  root.style.setProperty("--display-brightness", String(brightness / 100));
  try {
    localStorage.setItem("fotballjeger:theme", theme);
    localStorage.setItem("fotballjeger:accent", accent);
    localStorage.setItem("fotballjeger:brightness", String(brightness));
  } catch (e) {}
}

export default function SettingsApp() {
  const [theme,      setTheme]      = useState("dark");
  const [accent,     setAccent]     = useState("orange");
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.dataset.theme || "dark");
    setAccent(root.dataset.accent || "orange");
    const raw = parseFloat(root.style.getPropertyValue("--display-brightness") || "1");
    setBrightness(Math.round(raw * 100));
  }, []);

  const changeTheme = (t) => {
    setTheme(t);
    applyToDOM(t, accent, brightness);
  };
  const changeAccent = (a) => {
    setAccent(a);
    applyToDOM(theme, a, brightness);
  };
  const changeBrightness = (b) => {
    setBrightness(b);
    applyToDOM(theme, accent, b);
  };

  const sep = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--text-tertiary)",
    marginBottom: 10,
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
  const sepLine = { flex: 1, height: 1, background: "var(--bg-fourth)" };

  return (
    <div>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
        Settings
      </h2>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 20 }}>
        DISPLAY SETTINGS
      </p>

      {/* Theme */}
      <div style={sep}>
        <span>Theme</span><span style={sepLine}/>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => changeTheme(t.id)}
            style={{
              flex: 1,
              padding: "10px 0",
              border: "1px solid",
              borderColor: theme === t.id ? "var(--accent)" : "var(--bg-fourth)",
              background: theme === t.id ? "var(--accent-dim)" : "transparent",
              color: theme === t.id ? "var(--accent)" : "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Accent */}
      <div style={{ ...sep, marginTop: 24 }}>
        <span>Accent Color</span><span style={sepLine}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 4 }}>
        {ACCENTS.map(a => (
          <button
            key={a.id}
            onClick={() => changeAccent(a.id)}
            title={a.label}
            style={{
              height: 52,
              background: a.color,
              border: accent === a.id ? "3px solid var(--text-primary)" : "3px solid transparent",
              cursor: "pointer",
              transition: "border-color 0.12s",
              outline: "none",
              position: "relative",
            }}
          >
            {accent === a.id && (
              <span style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 700,
              }}>✓</span>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 4 }}>
        {ACCENTS.map(a => (
          <div key={a.id} style={{
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: accent === a.id ? "var(--accent-bright)" : "var(--text-tertiary)",
            letterSpacing: "0.06em",
          }}>{a.label}</div>
        ))}
      </div>

      {/* Brightness */}
      <div style={{ ...sep, marginTop: 24 }}>
        <span>Brightness</span><span style={sepLine}/>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="range"
          min={70}
          max={100}
          step={1}
          value={brightness}
          onChange={e => changeBrightness(+e.target.value)}
          style={{
            flex: 1,
            accentColor: "var(--accent)",
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        />
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-primary)",
          minWidth: 40,
          textAlign: "right",
        }}>{brightness}%</span>
      </div>

      {/* Wallpaper info */}
      <div style={{ ...sep, marginTop: 24 }}>
        <span>Wallpaper</span><span style={sepLine}/>
      </div>
      <div style={{
        background: "var(--bg-third)",
        border: "1px solid var(--bg-fourth)",
        padding: 14,
      }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", marginBottom: 4 }}>
          Football — Default
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>
          THEMED · CHANGES WITH ACCENT COLOR
        </div>
        <div style={{ marginTop: 12, height: 56, background: "var(--wallpaper-bg)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.35s" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em" }}>PREVIEW</span>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 12, border: "1px solid var(--bg-fourth)", background: "var(--bg-third)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 6 }}>VERSION</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Fotballjeger Career OS</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>BUILD 2026 · OSLO</div>
      </div>
    </div>
  );
}

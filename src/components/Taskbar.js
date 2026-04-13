"use client";

/* ── Inline SVG icons — 16x16, stroke currentColor ── */
const Icons = {
  overview: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="5" height="5" rx="0.5"/><rect x="9.5" y="1.5" width="5" height="5" rx="0.5"/>
      <rect x="1.5" y="9.5" width="5" height="5" rx="0.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="0.5"/>
    </svg>
  ),
  clubs: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M8 2L14 5v4c0 3.2-2.4 5.6-6 7-3.6-1.4-6-3.8-6-7V5L8 2z"/>
    </svg>
  ),
  trials: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/>
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  inbox: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <rect x="1.5" y="3.5" width="13" height="9" rx="0.5"/>
      <polyline points="1.5,3.5 8,9 14.5,3.5"/>
    </svg>
  ),
  network: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="3" r="1.8"/><circle cx="3" cy="12.5" r="1.8"/><circle cx="13" cy="12.5" r="1.8"/>
      <line x1="8" y1="4.8" x2="4.8" y2="10.8"/><line x1="8" y1="4.8" x2="11.2" y2="10.8"/>
      <line x1="4.8" y1="12.5" x2="11.2" y2="12.5"/>
    </svg>
  ),
  matches: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="4" width="13" height="9" rx="0.5"/>
      <line x1="8" y1="4" x2="8" y2="13"/>
      <circle cx="8" cy="8.5" r="2"/>
    </svg>
  ),
  pathway: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,13 5,8 8,10 12,4"/>
      <polyline points="9.5,4 12,4 12,6.5"/>
    </svg>
  ),
  physical: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M10 2L5.5 8h3.5L6 14l8-8.5H10.5L10 2z"/>
    </svg>
  ),
  somalia: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 2c0 0-2 2.5-2 6s2 6 2 6c0 0 2-2.5 2-6s-2-6-2-6z" strokeLinecap="round"/>
      <line x1="2.2" y1="8" x2="13.8" y2="8" strokeLinecap="round"/>
      <path d="M2.8 5.5c1.2-.5 3-.8 5.2-.8s4 .3 5.2.8" strokeLinecap="round"/>
      <path d="M2.8 10.5c1.2.5 3 .8 5.2.8s4-.3 5.2-.8" strokeLinecap="round"/>
    </svg>
  ),
  settings: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5"/>
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Taskbar({ apps, openWindows, focusedWindow, minimized, onOpenApp, onFocusApp }) {
  return (
    <nav
      style={{
        position: "relative",
        zIndex: 90,
        flexShrink: 0,
        borderTop: "1px solid var(--bg-fourth)",
        background: "var(--bg-primary)",
        padding: "10px 12px",
      }}
    >
      <ul style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}>
        {Object.values(apps).map((app) => {
          const isOpen   = openWindows.includes(app.id);
          const isFocused = focusedWindow === app.id && !minimized?.[app.id];
          const isMin    = minimized?.[app.id];
          const IconComp = Icons[app.id] || Icons.settings;

          return (
            <li
              key={app.id}
              style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
            >
              <button
                title={app.title}
                onClick={() => isOpen ? onFocusApp(app.id) : onOpenApp(app.id)}
                style={{
                  width: 40,
                  height: 40,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--bg-fourth)",
                  background: isFocused
                    ? "var(--accent-dim)"
                    : isOpen
                      ? "var(--button-secondary)"
                      : "var(--button-secondary)",
                  color: isFocused
                    ? "var(--text-accent)"
                    : isOpen
                      ? "var(--text-secondary)"
                      : "var(--text-tertiary)",
                  cursor: "pointer",
                  transition: "background 0.1s, color 0.1s, border-color 0.1s",
                  borderColor: isFocused ? "var(--accent)" : "var(--bg-fourth)",
                  outline: "none",
                }}
                onMouseEnter={e => {
                  if (!isFocused) {
                    e.currentTarget.style.background = "var(--bg-fourth)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isFocused
                    ? "var(--accent-dim)"
                    : "var(--button-secondary)";
                  e.currentTarget.style.color = isFocused
                    ? "var(--text-accent)"
                    : isOpen
                      ? "var(--text-secondary)"
                      : "var(--text-tertiary)";
                }}
              >
                {IconComp && (
                  <span style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconComp />
                  </span>
                )}
              </button>

              {/* Active indicator dot */}
              <span style={{
                position: "absolute",
                bottom: -2,
                left: "50%",
                transform: "translateX(-50%)",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: isFocused
                  ? "var(--accent)"
                  : isOpen && !isMin
                    ? "var(--text-tertiary)"
                    : "transparent",
                transition: "background 0.1s",
              }}/>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

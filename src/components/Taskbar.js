"use client";

export default function Taskbar({ apps, openWindows, focusedWindow, minimized, onOpenApp, onFocusApp }) {
  return (
    <div className="flex items-center justify-center shrink-0 relative z-50" style={{ height: 56, padding: "0 16px" }}>
      {/* Dock pill — rounded-full like wes */}
      <div
        className="flex items-center gap-1 px-2 py-1.5"
        style={{
          background: "rgba(34,24,17,0.75)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: 9999,
          border: "1px solid rgba(242,223,203,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        {Object.values(apps).map((app) => {
          const isOpen = openWindows.includes(app.id);
          const isFocused = focusedWindow === app.id;
          const isMin = minimized?.[app.id];

          return (
            <button
              key={app.id}
              className="relative flex items-center justify-center transition-all"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: isFocused && !isMin
                  ? "rgba(255,154,99,0.12)"
                  : isOpen
                    ? "rgba(242,223,203,0.06)"
                    : "transparent",
                color: isFocused && !isMin
                  ? "var(--color-accent)"
                  : isOpen
                    ? "var(--color-text-secondary)"
                    : "var(--color-text-tertiary)",
                fontSize: 16,
              }}
              onClick={() => isOpen ? onFocusApp(app.id) : onOpenApp(app.id)}
              title={app.title}
            >
              {app.icon}
              {/* Active dot indicator */}
              {isOpen && (
                <div
                  className="absolute"
                  style={{
                    bottom: 2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: isFocused && !isMin ? "var(--color-accent)" : "var(--color-text-tertiary)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

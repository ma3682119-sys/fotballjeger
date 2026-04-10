"use client";

export default function Taskbar({ apps, openWindows, focusedWindow, minimized, onOpenApp, onFocusApp }) {
  return (
    <div className="h-12 bg-[#0d0d12]/80 backdrop-blur-md border-t border-border flex items-center justify-center gap-1 px-2 z-50 relative shrink-0">
      {Object.values(apps).map((app) => {
        const isOpen = openWindows.includes(app.id);
        const isFocused = focusedWindow === app.id;
        const isMinimized = minimized?.[app.id];

        return (
          <button
            key={app.id}
            className={`
              relative flex items-center gap-1.5 px-3 h-8 rounded-md text-[12px] transition-all
              ${isFocused && !isMinimized
                ? "bg-white/[0.08] text-txt"
                : isOpen
                  ? "bg-white/[0.03] text-txt2 hover:bg-white/[0.06]"
                  : "text-txt3 hover:bg-white/[0.04] hover:text-txt2"
              }
            `}
            onClick={() => isOpen ? onFocusApp(app.id) : onOpenApp(app.id)}
            title={app.title}
          >
            <span className={`text-[11px] ${isFocused && !isMinimized ? "text-accent" : ""}`}>{app.icon}</span>
            <span className="hidden sm:inline">{app.title}</span>
            {/* Active indicator dot */}
            {isOpen && (
              <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isFocused && !isMinimized ? "bg-accent" : "bg-txt3"}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

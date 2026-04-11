"use client";
import { useState, useCallback } from "react";
import MenuBar from "./MenuBar";
import Taskbar from "./Taskbar";
import Window from "./Window";

import OverviewApp from "./apps/Overview";
import ClubsApp from "./apps/Clubs";
import TrialsApp from "./apps/Trials";
import InboxApp from "./apps/Inbox";
import NetworkApp from "./apps/Network";
import MatchesApp from "./apps/Matches";
import PathwayApp from "./apps/Pathway";
import PhysicalApp from "./apps/Physical";
import SomaliaApp from "./apps/Somalia";

const APPS = {
  overview: { id: "overview", title: "Overview", icon: "◇", w: 680, h: 520, component: OverviewApp },
  clubs: { id: "clubs", title: "Club Scouting", icon: "⬡", w: 720, h: 560, component: ClubsApp },
  trials: { id: "trials", title: "Trials Radar", icon: "◎", w: 620, h: 500, component: TrialsApp },
  inbox: { id: "inbox", title: "Inbox", icon: "▣", w: 600, h: 500, component: InboxApp },
  network: { id: "network", title: "Network", icon: "◈", w: 680, h: 540, component: NetworkApp },
  matches: { id: "matches", title: "Match Logger", icon: "▲", w: 680, h: 560, component: MatchesApp },
  pathway: { id: "pathway", title: "Pathway Sim", icon: "◆", w: 700, h: 560, component: PathwayApp },
  physical: { id: "physical", title: "Physical", icon: "●", w: 640, h: 520, component: PhysicalApp },
  somalia: { id: "somalia", title: "Somalia", icon: "★", w: 660, h: 560, component: SomaliaApp },
};

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState(["overview"]);
  const [focusedWindow, setFocusedWindow] = useState("overview");
  const [windowPositions, setWindowPositions] = useState({});
  const [minimized, setMinimized] = useState({});
  const [zStack, setZStack] = useState(["overview"]);

  const openApp = useCallback((id) => {
    if (!openWindows.includes(id)) setOpenWindows(prev => [...prev, id]);
    setMinimized(prev => ({ ...prev, [id]: false }));
    setFocusedWindow(id);
    setZStack(prev => [...prev.filter(w => w !== id), id]);
  }, [openWindows]);

  const closeApp = useCallback((id) => {
    setOpenWindows(prev => prev.filter(w => w !== id));
    setZStack(prev => prev.filter(w => w !== id));
    if (focusedWindow === id) {
      const remaining = openWindows.filter(w => w !== id);
      setFocusedWindow(remaining[remaining.length - 1] || null);
    }
  }, [openWindows, focusedWindow]);

  const minimizeApp = useCallback((id) => {
    setMinimized(prev => ({ ...prev, [id]: true }));
    const remaining = openWindows.filter(w => w !== id && !minimized[w]);
    setFocusedWindow(remaining[remaining.length - 1] || null);
  }, [openWindows, minimized]);

  const focusApp = useCallback((id) => {
    setMinimized(prev => ({ ...prev, [id]: false }));
    setFocusedWindow(id);
    setZStack(prev => [...prev.filter(w => w !== id), id]);
  }, []);

  const getDefaultPos = (id) => {
    const idx = Object.keys(APPS).indexOf(id);
    return { x: 120 + (idx % 4) * 50, y: 60 + (idx % 3) * 40 };
  };

  const updatePosition = useCallback((id, pos) => {
    setWindowPositions(prev => ({ ...prev, [id]: pos }));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: "var(--color-bg-desktop)" }}>
      {/* Wallpaper — warm gradient matching wes dark theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #1a120c 0%, #221811 30%, #1e150f 60%, #261c14 100%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(255,154,99,0.04) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 20%, rgba(76,163,103,0.03) 0%, transparent 50%)`,
        }} />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }} />
      </div>

      {/* Menu bar */}
      <MenuBar focusedApp={focusedWindow ? APPS[focusedWindow]?.title : null} />

      {/* Desktop area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {/* Desktop icons — column on left side */}
        <div className="absolute left-5 top-5 flex flex-col gap-0.5 z-0">
          {Object.values(APPS).map((app) => (
            <button
              key={app.id}
              className="flex flex-col items-center justify-center rounded-lg text-center transition-colors"
              style={{
                width: 72,
                height: 64,
                background: "transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(242,223,203,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => openApp(app.id)}
            >
              <span className="text-lg mb-0.5" style={{ color: "var(--color-text-tertiary)" }}>{app.icon}</span>
              <span className="text-[10px] leading-tight font-medium" style={{ color: "var(--color-text-tertiary)" }}>{app.title}</span>
            </button>
          ))}
        </div>

        {/* Windows */}
        {openWindows.map(id => {
          const app = APPS[id];
          if (!app) return null;
          const pos = windowPositions[id] || getDefaultPos(id);
          const zIndex = zStack.indexOf(id) + 1;
          const isFocused = focusedWindow === id;
          const isMinimized = minimized[id];
          const AppComponent = app.component;

          return (
            <Window
              key={id}
              id={id}
              title={app.title}
              icon={app.icon}
              width={app.w}
              height={app.h}
              x={pos.x}
              y={pos.y}
              zIndex={zIndex}
              focused={isFocused}
              minimized={isMinimized}
              onFocus={() => focusApp(id)}
              onClose={() => closeApp(id)}
              onMinimize={() => minimizeApp(id)}
              onMove={(newPos) => updatePosition(id, newPos)}
            >
              <AppComponent />
            </Window>
          );
        })}
      </div>

      {/* Dock */}
      <Taskbar
        apps={APPS}
        openWindows={openWindows}
        focusedWindow={focusedWindow}
        minimized={minimized}
        onOpenApp={openApp}
        onFocusApp={focusApp}
      />
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import MenuBar from "./MenuBar";
import Taskbar from "./Taskbar";
import Window from "./Window";

// All available apps
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
  overview: { id: "overview", title: "Overview", icon: "◇", w: 680, h: 560, component: OverviewApp },
  clubs: { id: "clubs", title: "Club Scouting", icon: "⬡", w: 780, h: 600, component: ClubsApp },
  trials: { id: "trials", title: "Trials Radar", icon: "◎", w: 640, h: 520, component: TrialsApp },
  inbox: { id: "inbox", title: "Inbox", icon: "▣", w: 620, h: 540, component: InboxApp },
  network: { id: "network", title: "Network", icon: "◈", w: 700, h: 560, component: NetworkApp },
  matches: { id: "matches", title: "Match Logger", icon: "▲", w: 700, h: 600, component: MatchesApp },
  pathway: { id: "pathway", title: "Pathway Sim", icon: "◆", w: 720, h: 580, component: PathwayApp },
  physical: { id: "physical", title: "Physical", icon: "●", w: 660, h: 560, component: PhysicalApp },
  somalia: { id: "somalia", title: "Somalia", icon: "★", w: 680, h: 600, component: SomaliaApp },
};

export default function Desktop() {
  const [openWindows, setOpenWindows] = useState(["overview"]);
  const [focusedWindow, setFocusedWindow] = useState("overview");
  const [windowPositions, setWindowPositions] = useState({});
  const [minimized, setMinimized] = useState({});
  const [zStack, setZStack] = useState(["overview"]);

  const openApp = useCallback((id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows(prev => [...prev, id]);
    }
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
    return { x: 80 + (idx % 4) * 40, y: 60 + (idx % 3) * 30 };
  };

  const updatePosition = useCallback((id, pos) => {
    setWindowPositions(prev => ({ ...prev, [id]: pos }));
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-bg">
      {/* Wallpaper layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0a] via-[#0a0a0f] to-[#0f0a0a]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(74,222,128,0.15) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(167,139,250,0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Menu bar */}
      <MenuBar focusedApp={focusedWindow ? APPS[focusedWindow]?.title : null} />

      {/* Desktop area */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {/* Desktop icons */}
        <div className="absolute left-4 top-4 flex flex-col gap-1 z-0">
          {Object.values(APPS).map((app) => (
            <button
              key={app.id}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-left hover:bg-white/[0.04] transition-colors group w-[160px]"
              onDoubleClick={() => openApp(app.id)}
              onClick={() => openApp(app.id)}
            >
              <span className="text-sm text-txt3 group-hover:text-accent transition-colors">{app.icon}</span>
              <span className="text-[12px] text-txt2 group-hover:text-txt transition-colors truncate">{app.title}</span>
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

      {/* Taskbar */}
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

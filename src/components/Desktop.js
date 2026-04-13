"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import MenuBar  from "./MenuBar";
import Taskbar  from "./Taskbar";
import Window   from "./Window";

import OverviewApp  from "./apps/Overview";
import ClubsApp     from "./apps/Clubs";
import TrialsApp    from "./apps/Trials";
import InboxApp     from "./apps/Inbox";
import NetworkApp   from "./apps/Network";
import MatchesApp   from "./apps/Matches";
import PathwayApp   from "./apps/Pathway";
import PhysicalApp  from "./apps/Physical";
import SomaliaApp   from "./apps/Somalia";
import SettingsApp  from "./Settings";

/* ── App registry ── */
const APPS = {
  overview: { id: "overview", title: "Overview",     w: 680, h: 520, component: OverviewApp  },
  clubs:    { id: "clubs",    title: "Club Scouting", w: 720, h: 560, component: ClubsApp     },
  trials:   { id: "trials",  title: "Trials Radar",  w: 620, h: 500, component: TrialsApp    },
  inbox:    { id: "inbox",   title: "Inbox",          w: 600, h: 500, component: InboxApp     },
  network:  { id: "network", title: "Network",        w: 680, h: 540, component: NetworkApp   },
  matches:  { id: "matches", title: "Match Logger",   w: 680, h: 560, component: MatchesApp   },
  pathway:  { id: "pathway", title: "Pathway Sim",    w: 700, h: 560, component: PathwayApp   },
  physical: { id: "physical",title: "Physical",       w: 640, h: 520, component: PhysicalApp  },
  somalia:  { id: "somalia", title: "Somalia",        w: 660, h: 560, component: SomaliaApp   },
  settings: { id: "settings",title: "Settings",       w: 480, h: 600, component: SettingsApp  },
};

/* ── Desktop files ── */
const DESKTOP_FILES = [
  {
    type: "folder", id: "match-videos", name: "Match Videos",
    children: [
      { type: "text", name: "vs-kjelss.txt", content: "Match vs Kjelsås\nDate: 15 Aug 2024\nResult: Win 3-1\nRating: 8.5\nGoals: 1  Assists: 2\nMinutes: 90" },
      { type: "text", name: "training-highlights.txt", content: "Training Session\nDate: 12 Aug 2024\nDuration: 90 min\nFocus: Pressing + transition" },
    ],
  },
  {
    type: "folder", id: "scouting-data", name: "Scouting Data",
    children: [
      { type: "text", name: "oslo-clubs-2024.txt", content: "Oslo Club Scouting Report\nUpdated: Aug 2024\n\nKjelsås:  Tier 1 · path score 68%\nFrigg:    Tier 2 · path score 72%\nGrei:     Tier 2 · path score 55%\nVålerenga: AVOID  · path score 14%\nSkeid:    Tier 1 · path score 61%" },
    ],
  },
  { type: "app",  id: "pathway.app",  name: "Pathway",  appId: "pathway" },
  { type: "app",  id: "somalia.app",  name: "Somalia",  appId: "somalia" },
  {
    type: "text", id: "career-plan.txt", name: "career-plan.txt",
    content: "CAREER PLAN 2024–2028\n\nGoal: Professional contract by 21\nPrimary path: G17 → Senior → Somalia NT\n\n2024  Join top Oslo G17 club\n2025  Senior debut, div 4-5\n2026  Establish in senior squad\n2027  Somalia national call-up\n2028  AFCON qualification\n\nPhysical target: 188-190cm @ 18yo\neligibility: CLEAN — 0 competitive caps",
  },
];

/* ── Folder icon (retro Wes style) ── */
function FolderIcon() {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 48, height: 36 }}>
      <span style={{
        position: "absolute", left: 4, top: 0, width: 22, height: 9,
        background: "var(--bg-third)",
        border: "1px solid var(--bg-fourth)",
        borderBottom: "none",
      }}/>
      <span style={{
        position: "absolute", left: 0, right: 0, bottom: 0, top: 8,
        border: "1px solid var(--bg-fourth)",
        background: "var(--bg-third)",
      }}/>
    </span>
  );
}

/* ── Text-file icon (dog-ear corner) ── */
function TextFileIcon() {
  return (
    <span style={{
      position: "relative", display: "inline-block",
      width: 36, height: 44,
      border: "1px solid var(--bg-fourth)",
      background: "var(--bg-primary)",
    }}>
      <span style={{
        position: "absolute", right: 0, top: 0, width: 11, height: 11,
        borderLeft: "1px solid var(--bg-fourth)",
        borderBottom: "1px solid var(--bg-fourth)",
        background: "var(--bg-third)",
      }}/>
      <span style={{ position: "absolute", left: 6, top: 16, height: 2, width: 22, background: "var(--bg-secondary)" }}/>
      <span style={{ position: "absolute", left: 6, top: 24, height: 2, width: 18, background: "var(--bg-secondary)" }}/>
      <span style={{ position: "absolute", left: 6, top: 32, height: 2, width: 14, background: "var(--bg-secondary)" }}/>
    </span>
  );
}

/* ── App shortcut icon ── */
function AppShortcutIcon({ appId }) {
  const emoji = { pathway: "◆", somalia: "★" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 44, height: 44,
      border: "1px solid var(--bg-fourth)",
      background: "var(--bg-primary)",
      color: "var(--accent)",
      fontSize: 18,
    }}>
      {emoji[appId] || "⬡"}
    </span>
  );
}

/* ── Loading screen ── */
function LoadingScreen({ out }) {
  return (
    <div className={`loading-screen${out ? " out" : ""}`}>
      <div style={{
        border: "1px solid var(--bg-fourth)",
        background: "var(--bg-secondary)",
        minWidth: 220,
        padding: "16px 20px",
      }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
          Loading workspace
        </p>
        <div className="loading-bar-track">
          <span className="loading-bar-fill"/>
        </div>
      </div>
    </div>
  );
}

/* ── Text/folder window content ── */
function FolderWindowContent({ file }) {
  if (file.type === "text") {
    return (
      <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {file.content}
      </pre>
    );
  }
  if (file.type === "folder") {
    return (
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.08em", marginBottom: 12 }}>
          {file.children?.length ?? 0} ITEMS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {(file.children || []).map((child, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 10px",
              border: "1px solid var(--bg-fourth)",
              background: "var(--button-secondary)",
            }}>
              <span style={{ color: "var(--text-tertiary)", fontSize: 12 }}>
                {child.type === "text" ? "📄" : "📁"}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{child.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ══════════════════════════════════════
   MAIN DESKTOP COMPONENT
   ══════════════════════════════════════ */
export default function Desktop() {
  const [loaded,  setLoaded]  = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  /* Window state */
  const [openWindows,     setOpenWindows]     = useState(["overview"]);
  const [focusedWindow,   setFocusedWindow]   = useState("overview");
  const [windowPositions, setWindowPositions] = useState({});
  const [minimized,       setMinimized]       = useState({});
  const [zStack,          setZStack]          = useState(["overview"]);

  /* File windows (folders / text files opened from desktop) */
  const [fileWindows, setFileWindows] = useState([]); // [{id, title, file}]

  /* Loading sequence */
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1100);
    const t2 = setTimeout(() => setLoaded(true),  1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Restore theme from localStorage on mount */
  useEffect(() => {
    try {
      const theme  = localStorage.getItem("fotballjeger:theme")      || "dark";
      const accent = localStorage.getItem("fotballjeger:accent")     || "orange";
      const rawBr  = parseInt(localStorage.getItem("fotballjeger:brightness") || "100", 10);
      const br     = isFinite(rawBr) ? Math.min(100, Math.max(70, rawBr)) : 100;
      const root   = document.documentElement;
      root.dataset.theme  = theme;
      root.dataset.accent = accent;
      root.style.setProperty("--display-brightness", String(br / 100));
    } catch (e) {}
  }, []);

  /* ── App window management ── */
  const openApp = useCallback((id) => {
    if (!openWindows.includes(id)) setOpenWindows(p => [...p, id]);
    setMinimized(p => ({ ...p, [id]: false }));
    setFocusedWindow(id);
    setZStack(p => [...p.filter(w => w !== id), id]);
  }, [openWindows]);

  const closeApp = useCallback((id) => {
    setOpenWindows(p => p.filter(w => w !== id));
    setZStack(p => p.filter(w => w !== id));
    if (focusedWindow === id) {
      const rem = openWindows.filter(w => w !== id);
      setFocusedWindow(rem[rem.length - 1] || null);
    }
  }, [openWindows, focusedWindow]);

  const minimizeApp = useCallback((id) => {
    setMinimized(p => ({ ...p, [id]: true }));
    const rem = openWindows.filter(w => w !== id && !minimized[w]);
    setFocusedWindow(rem[rem.length - 1] || null);
  }, [openWindows, minimized]);

  const focusApp = useCallback((id) => {
    setMinimized(p => ({ ...p, [id]: false }));
    setFocusedWindow(id);
    setZStack(p => [...p.filter(w => w !== id), id]);
  }, []);

  const updatePos = useCallback((id, pos) => {
    setWindowPositions(p => ({ ...p, [id]: pos }));
  }, []);

  /* ── File window management ── */
  const openFile = useCallback((file) => {
    const winId = `file-${file.id}`;
    if (!fileWindows.find(w => w.id === winId)) {
      setFileWindows(p => [...p, { id: winId, title: file.name, file }]);
    }
    setFocusedWindow(winId);
    setZStack(p => [...p.filter(w => w !== winId), winId]);
  }, [fileWindows]);

  const closeFile = useCallback((winId) => {
    setFileWindows(p => p.filter(w => w.id !== winId));
    setZStack(p => p.filter(w => w !== winId));
    if (focusedWindow === winId) setFocusedWindow(null);
  }, [focusedWindow]);

  const focusFile = useCallback((winId) => {
    setFocusedWindow(winId);
    setZStack(p => [...p.filter(w => w !== winId), winId]);
  }, []);

  const handleDesktopFileClick = useCallback((file) => {
    if (file.type === "app") {
      openApp(file.appId);
    } else {
      openFile(file);
    }
  }, [openApp, openFile]);

  /* ── Default window position ── */
  const getDefaultPos = (id) => {
    const keys = Object.keys(APPS);
    const idx = keys.indexOf(id);
    return {
      x: 108 + (idx % 4) * 44,
      y: 54  + (idx % 3) * 38,
    };
  };

  /* Unified z-index from zStack */
  const zOf = (winId) => (zStack.indexOf(winId) + 1) * 10;

  /* Max z-index for file windows stacking above apps by default */
  const allWindowCount = openWindows.length + fileWindows.length;

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>

      {/* ══ Layer 1: Wallpaper ══ */}
      <div className="desktop-wallpaper-layer">
        <img
          src="/football.svg"
          alt="Football wallpaper"
          className="desktop-wallpaper-art"
          draggable={false}
        />
      </div>

      {/* ══ Layer 2: UI ══ */}
      <div className="desktop-ui-layer">
        <MenuBar
          focusedApp={focusedWindow ? (APPS[focusedWindow]?.title || null) : null}
          onOpenApp={openApp}
        />

        {/* Desktop area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* Desktop file icons — left column */}
          <nav
            aria-label="Desktop files"
            style={{
              position: "absolute",
              left: 16, top: 16,
              zIndex: 5,
              maxHeight: "calc(100vh - 110px)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <ul style={{ display: "flex", flexDirection: "column", gap: 16, listStyle: "none", padding: 0, margin: 0 }}>
              {DESKTOP_FILES.map(file => (
                <li key={file.id}>
                  <button
                    className="desktop-file-btn"
                    onDoubleClick={() => handleDesktopFileClick(file)}
                    onClick={() => handleDesktopFileClick(file)}
                  >
                    {file.type === "folder" && <FolderIcon />}
                    {file.type === "text"   && <TextFileIcon />}
                    {file.type === "app"    && <AppShortcutIcon appId={file.appId} />}
                    <span className="desktop-file-label">{file.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* App windows */}
          {openWindows.map(id => {
            const app = APPS[id];
            if (!app) return null;
            const pos       = windowPositions[id] || getDefaultPos(id);
            const isFocused = focusedWindow === id;
            const isMin     = minimized[id];
            const AppComp   = app.component;

            return (
              <Window
                key={id}
                id={id}
                title={app.title}
                width={app.w}
                height={app.h}
                x={pos.x}
                y={pos.y}
                zIndex={zOf(id)}
                focused={isFocused}
                minimized={isMin}
                onFocus={() => focusApp(id)}
                onClose={() => closeApp(id)}
                onMinimize={() => minimizeApp(id)}
                onMove={newPos => updatePos(id, newPos)}
              >
                <AppComp />
              </Window>
            );
          })}

          {/* File/folder windows */}
          {fileWindows.map(win => {
            const pos = windowPositions[win.id] || { x: 200, y: 80 };
            const isFocused = focusedWindow === win.id;
            return (
              <Window
                key={win.id}
                id={win.id}
                title={win.title}
                width={win.file.type === "folder" ? 420 : 500}
                height={win.file.type === "folder" ? 340 : 400}
                x={pos.x}
                y={pos.y}
                zIndex={zOf(win.id)}
                focused={isFocused}
                minimized={false}
                onFocus={() => focusFile(win.id)}
                onClose={() => closeFile(win.id)}
                onMinimize={() => closeFile(win.id)}
                onMove={newPos => updatePos(win.id, newPos)}
              >
                <FolderWindowContent file={win.file} />
              </Window>
            );
          })}
        </div>

        <Taskbar
          apps={APPS}
          openWindows={openWindows}
          focusedWindow={focusedWindow}
          minimized={minimized}
          onOpenApp={openApp}
          onFocusApp={focusApp}
        />
      </div>

      {/* ══ Loading screen ══ */}
      {!loaded && <LoadingScreen out={fadeOut} />}
    </div>
  );
}

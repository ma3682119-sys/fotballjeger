"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export default function Window({
  id, title, width, height, x, y, zIndex,
  focused, minimized, onFocus, onClose, onMinimize, onMove, children,
}) {
  const [dragging, setDragging]   = useState(false);
  const [dragOff,  setDragOff]    = useState({ x: 0, y: 0 });
  const [pos,      setPos]        = useState({ x, y });
  const [size,     setSize]       = useState({ w: width, h: height });
  const [maximized,setMaximized]  = useState(false);
  const prevRef = useRef({ x, y, w: width, h: height });

  useEffect(() => { setPos({ x, y }); }, [x, y]);

  const handleTitleDown = useCallback((e) => {
    if (e.target.closest("[data-winbtn]")) return;
    e.preventDefault();
    onFocus();
    setDragging(true);
    setDragOff({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [pos, onFocus]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      setPos({
        x: Math.max(0, e.clientX - dragOff.x),
        y: Math.max(36, e.clientY - dragOff.y),
      });
    };
    const up = () => {
      setDragging(false);
      setPos(p => { onMove(p); return p; });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [dragging, dragOff, onMove]);

  const toggleMax = () => {
    if (maximized) {
      setPos({ x: prevRef.current.x, y: prevRef.current.y });
      setSize({ w: prevRef.current.w, h: prevRef.current.h });
    } else {
      prevRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
      setPos({ x: 0, y: 36 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 36 - 57 });
    }
    setMaximized(m => !m);
  };

  if (minimized) return null;

  const br = maximized ? 0 : 0; // Wes uses sharp corners on windows

  return (
    <div
      className={focused ? "window-shadow-focused" : "window-shadow"}
      onMouseDown={onFocus}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: zIndex * 10,
        borderRadius: br,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${focused ? "var(--bg-fourth)" : "rgba(242,223,203,0.05)"}`,
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
    >
      {/* ── Title bar ── */}
      <div
        onMouseDown={handleTitleDown}
        style={{
          height: 36,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          background: focused ? "var(--bg-third)" : "var(--bg-secondary)",
          borderBottom: `1px solid ${focused ? "var(--bg-fourth)" : "rgba(242,223,203,0.04)"}`,
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          position: "relative",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} data-winbtn>
          <button
            onClick={onClose}
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 7, color: "rgba(0,0,0,0.5)", opacity: 0, lineHeight: 1, fontWeight: 700 }} className="group-hover:opacity-100">✕</span>
          </button>
          <button
            onClick={onMinimize}
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E", border: "none", cursor: "pointer" }}
          />
          <button
            onClick={toggleMax}
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C940", border: "none", cursor: "pointer" }}
          />
        </div>
        {/* Title centered */}
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 13,
          fontWeight: 500,
          color: focused ? "var(--text-primary)" : "var(--text-tertiary)",
          whiteSpace: "nowrap",
        }}>
          {title}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          background: focused ? "var(--bg-secondary)" : "var(--bg-primary)",
        }}
      >
        <div style={{ padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

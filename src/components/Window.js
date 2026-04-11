"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export default function Window({
  id, title, icon, width, height, x, y, zIndex,
  focused, minimized, onFocus, onClose, onMinimize, onMove, children,
}) {
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x, y });
  const [size, setSize] = useState({ w: width, h: height });
  const [maximized, setMaximized] = useState(false);
  const prevSize = useRef({ x, y, w: width, h: height });

  useEffect(() => { setPos({ x, y }); }, [x, y]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest("[data-window-btn]")) return;
    onFocus();
    setDragging(true);
    setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [pos, onFocus]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e) => {
      const newX = Math.max(0, e.clientX - dragOffset.x);
      const newY = Math.max(36, e.clientY - dragOffset.y);
      setPos({ x: newX, y: newY });
    };
    const handleUp = () => {
      setDragging(false);
      onMove(pos);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, dragOffset, pos, onMove]);

  const toggleMaximize = () => {
    if (maximized) {
      setPos({ x: prevSize.current.x, y: prevSize.current.y });
      setSize({ w: prevSize.current.w, h: prevSize.current.h });
    } else {
      prevSize.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
      setPos({ x: 0, y: 36 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 36 - 56 });
    }
    setMaximized(!maximized);
  };

  if (minimized) return null;

  const borderRadius = maximized ? 0 : 10;

  return (
    <div
      className={`absolute flex flex-col ${focused ? "window-shadow-focused" : "window-shadow"}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: zIndex * 10,
        borderRadius,
        overflow: "hidden",
        border: `1px solid ${focused ? "rgba(242,223,203,0.12)" : "rgba(242,223,203,0.06)"}`,
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseDown={onFocus}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center shrink-0 select-none"
        style={{
          height: 36,
          padding: "0 14px",
          background: focused ? "var(--color-bg-secondary)" : "rgba(48,35,27,0.7)",
          borderBottom: `1px solid ${focused ? "rgba(242,223,203,0.08)" : "rgba(242,223,203,0.04)"}`,
          borderRadius: maximized ? 0 : "10px 10px 0 0",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic lights — 12px, gap 8px like wes */}
        <div className="flex items-center" style={{ gap: 8 }} data-window-btn>
          <button
            className="flex items-center justify-center group"
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }}
            onClick={onClose}
          >
            <span className="text-[7px] text-black/50 opacity-0 group-hover:opacity-100 leading-none font-bold">✕</span>
          </button>
          <button
            className="flex items-center justify-center group"
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }}
            onClick={onMinimize}
          >
            <span className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100 leading-none font-bold">−</span>
          </button>
          <button
            className="flex items-center justify-center group"
            style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C940" }}
            onClick={toggleMaximize}
          >
            <span className="text-[7px] text-black/50 opacity-0 group-hover:opacity-100 leading-none font-bold">⤢</span>
          </button>
        </div>

        {/* Title — centered */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: focused ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
          }}
        >
          <span style={{ fontSize: 11, opacity: 0.5 }}>{icon}</span>
          <span>{title}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          background: focused ? "var(--color-bg-primary)" : "rgba(34,24,17,0.95)",
          borderRadius: maximized ? 0 : "0 0 10px 10px",
        }}
      >
        <div style={{ padding: "20px 24px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

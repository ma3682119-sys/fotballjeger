"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export default function Window({
  id, title, icon, width, height, x, y, zIndex,
  focused, minimized, onFocus, onClose, onMinimize, onMove, children,
}) {
  const dragRef = useRef(null);
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
      const newY = Math.max(32, e.clientY - dragOffset.y);
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
      setPos({ x: 0, y: 0 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 80 });
    }
    setMaximized(!maximized);
  };

  if (minimized) return null;

  return (
    <div
      ref={dragRef}
      className={`absolute flex flex-col window-shadow transition-shadow ${focused ? "opacity-100" : "opacity-90"}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: zIndex * 10,
        borderRadius: maximized ? 0 : 8,
        overflow: "hidden",
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className={`h-9 flex items-center justify-between px-3 shrink-0 select-none ${
          focused ? "bg-titlebar" : "bg-[#141417]"
        }`}
        style={{ borderRadius: maximized ? 0 : "8px 8px 0 0", cursor: dragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5" data-window-btn>
          <button
            className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group"
            onClick={onClose}
          >
            <span className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button
            className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-110 transition-all flex items-center justify-center group"
            onClick={onMinimize}
          >
            <span className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100">−</span>
          </button>
          <button
            className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-110 transition-all flex items-center justify-center group"
            onClick={toggleMaximize}
          >
            <span className="text-[8px] text-black/50 opacity-0 group-hover:opacity-100">⤢</span>
          </button>
        </div>

        {/* Title */}
        <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[12px] ${focused ? "text-txt2" : "text-txt3"}`}>
          <span className="text-[10px]">{icon}</span>
          <span>{title}</span>
        </div>

        <div />
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden bg-bg"
        style={{ borderRadius: maximized ? 0 : "0 0 8px 8px" }}
      >
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

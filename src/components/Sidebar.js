"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Overview", icon: "◇", color: "text-green" },
  { href: "/clubs", label: "Club scouting", icon: "⬡", color: "text-blue" },
  { href: "/trials", label: "Trials radar", icon: "◎", color: "text-purple" },
  { href: "/inbox", label: "Inbox", icon: "▣", color: "text-amber" },
  { href: "/network", label: "Network", icon: "◈", color: "text-red" },
  { href: "/matches", label: "Match logger", icon: "▲", color: "text-green" },
  { href: "/pathway", label: "Pathway sim", icon: "◆", color: "text-purple" },
  { href: "/physical", label: "Physical", icon: "●", color: "text-red" },
  { href: "/somalia", label: "Somalia", icon: "★", color: "text-gold" },
];

const BADGES = { "/inbox": 3, "/trials": 2, "/network": 1, "/somalia": "!" };

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-[220px] h-screen fixed left-0 top-0 bg-bg2 border-r border-border flex flex-col z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <span className="text-2xl text-green glow-green animate-flicker leading-none">◈</span>
        <div>
          <div className="font-[family-name:var(--font-display)] text-sm font-bold text-txt tracking-tight">
            FOTBALLJEGER
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 tracking-wider uppercase">
            Career OS · v2.0 · Oslo
          </div>
        </div>
      </div>

      {/* Terminal header */}
      <div className="px-4 pt-3 pb-1">
        <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 tracking-widest uppercase">
          ┌─ NAVIGATION ─────────┐
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 w-full px-4 py-2 text-[13px] transition-all relative group
                ${active
                  ? "bg-bg3 text-txt font-medium"
                  : "text-txt2 hover:bg-bg3/50 hover:text-txt"
                }
              `}
            >
              {active && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-green rounded-r shadow-[0_0_8px_var(--color-green)]" />
              )}
              <span className={`text-[10px] ${active ? item.color : "text-txt3 group-hover:" + item.color} transition-colors`}>
                {item.icon}
              </span>
              <span className="flex-1 font-[family-name:var(--font-body)]">{item.label}</span>
              {BADGES[item.href] && (
                <span className={`
                  font-[family-name:var(--font-mono)] text-[10px] px-1.5 min-w-[18px] text-center rounded-md
                  ${item.href === "/somalia"
                    ? "bg-gold-dim text-gold"
                    : "bg-red-dim text-red"
                  }
                `}>
                  {BADGES[item.href]}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Terminal footer */}
      <div className="px-4 pb-1">
        <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 tracking-widest">
          └────────────────────┘
        </div>
      </div>

      {/* Status footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_6px_var(--color-green)] animate-pulse-glow" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-green">
            SCANNER ONLINE
          </span>
        </div>
        <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mt-0.5 pl-3.5">
          SYS OK · 5 sources active
        </div>
        <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 pl-3.5 mt-0.5 cursor-blink">
          &gt; ready_
        </div>
      </div>
    </nav>
  );
}

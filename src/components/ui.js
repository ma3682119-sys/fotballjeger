"use client";

const BADGE_STYLES = {
  green: "bg-green-dim text-green border border-green/25",
  amber: "bg-amber-dim text-amber border border-amber/20",
  red: "bg-red-dim text-red border border-red/20",
  purple: "bg-purple-dim text-purple border border-purple/20",
  blue: "bg-blue-dim text-blue border border-blue/20",
  gray: "bg-bg4 text-txt2 border border-border",
  gold: "bg-gold-dim text-gold border border-gold/20",
};

export function Badge({ type = "gray", children }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] ${BADGE_STYLES[type] || BADGE_STYLES.gray}`}>
      {children}
    </span>
  );
}

export function StatGrid({ stats, cols = 4 }) {
  return (
    <div className={`grid gap-2 mb-6`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {stats.map((s, i) => (
        <div key={i} className="bg-bg3 border border-border rounded-lg p-3.5 text-center relative overflow-hidden group">
          {/* Retro corner decorations */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green/20" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green/20" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green/20" />
          <div
            className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-none"
            style={s.color ? { color: s.color } : {}}
          >
            {s.val}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-1.5 uppercase tracking-wider">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

const INSIGHT_STYLES = {
  green: "border-l-green bg-bg3",
  purple: "border-l-purple bg-bg3",
  amber: "border-l-amber bg-bg3",
  gold: "border-l-gold bg-gold-dim",
  red: "border-l-red bg-red-dim",
};

export function Insight({ type = "green", children, className = "" }) {
  const glowClass = type === "gold" ? "text-gold" : type === "red" ? "text-red/80" : "text-txt2";
  return (
    <div className={`text-xs ${glowClass} rounded-lg p-2.5 my-2 leading-relaxed border-l-2 ${INSIGHT_STYLES[type] || INSIGHT_STYLES.green} ${className}`}>
      <span className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 uppercase tracking-wider block mb-1">
        &gt; INTEL
      </span>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-txt3 tracking-[0.12em] uppercase my-4 flex items-center gap-2">
      <span className="text-green/40">├─</span>
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export function PageTitle({ children, sub }) {
  return (
    <div className="mb-6">
      <div className="font-[family-name:var(--font-display)] text-[22px] font-bold text-txt tracking-tight">
        {children}
      </div>
      {sub && (
        <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-1 tracking-wider">
          {sub}
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ value, color = "var(--color-green)", className = "" }) {
  return (
    <div className={`h-[3px] bg-bg4 rounded-sm my-1.5 ${className}`}>
      <div
        className="h-[3px] rounded-sm transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%`, background: color, boxShadow: `0 0 6px ${color}40` }}
      />
    </div>
  );
}

export function Card({ children, className = "", glow, ...props }) {
  const glowBorder = glow === "gold" ? "border-gold/25" : glow === "red" ? "border-red/25" : glow === "purple" ? "border-purple/25" : "";
  return (
    <div
      className={`bg-bg2 border border-border rounded-xl p-4 mb-2 transition-all hover:border-border2 relative ${glowBorder} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlowDot({ color = "var(--color-green)" }) {
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0 animate-pulse-glow"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    />
  );
}

export function Dot({ type = "gray" }) {
  const colors = {
    green: "bg-green shadow-[0_0_6px_var(--color-green)]",
    red: "bg-red",
    gray: "bg-txt3",
    amber: "bg-amber",
  };
  return <div className={`w-2 h-2 rounded-full shrink-0 ${colors[type] || colors.gray}`} />;
}

export function Avatar({ initials, color = "green", size = 36 }) {
  const colors = {
    green: "bg-green-dim text-green",
    purple: "bg-purple-dim text-purple",
    amber: "bg-amber-dim text-amber",
    blue: "bg-blue-dim text-blue",
    red: "bg-red-dim text-red",
    gold: "bg-gold-dim text-gold",
  };
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 font-[family-name:var(--font-display)] ${colors[color] || colors.green}`}
      style={{ width: size, height: size, fontSize: size * 0.33 }}
    >
      {initials}
    </div>
  );
}

export function MiniChart({ data, colors, height = 36 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm min-h-[3px] transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            background: colors ? colors[i] : "var(--color-green)",
          }}
        />
      ))}
    </div>
  );
}

export function TagRow({ tags }) {
  return (
    <div className="flex gap-1 flex-wrap my-1.5">
      {tags.map((t) => (
        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-bg4 text-txt2 font-[family-name:var(--font-mono)]">
          {t}
        </span>
      ))}
    </div>
  );
}

export function StepRow({ steps }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} className="flex gap-2 py-1">
          <div className="flex flex-col items-center">
            <div className="w-[7px] h-[7px] rounded-full mt-1.5" style={{ background: s.color, boxShadow: `0 0 4px ${s.color}40` }} />
            {i < steps.length - 1 && <div className="w-px flex-1 bg-border2 mx-[3px] min-h-[16px]" />}
          </div>
          <div>
            <div className="text-xs font-medium text-txt font-[family-name:var(--font-display)]">{s.title}</div>
            <div className="text-[11px] text-txt2">{s.sub}</div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] bg-amber-dim text-amber px-1.5 py-px rounded mt-1 inline-block">
              {s.deadline}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrialDate({ month, day }) {
  return (
    <div className="font-[family-name:var(--font-display)] text-[11px] font-bold text-blue bg-blue-dim px-2.5 py-1.5 rounded-lg text-center min-w-[44px] leading-tight shrink-0 border border-blue/20">
      {month}<br />{day}
    </div>
  );
}

export function CoachAlertPill({ name, weeksAgo }) {
  return (
    <div className="font-[family-name:var(--font-mono)] text-[10px] text-red bg-red-dim px-2.5 py-1 rounded-md mb-2 flex items-center gap-1.5 border border-red/15">
      <div className="w-1.5 h-1.5 rounded-full bg-red shrink-0 animate-pulse-glow" />
      ⚠ NEW COACH: {name} · {weeksAgo}w ago
    </div>
  );
}

export function RatingDisplay({ value }) {
  const color = value >= 8 ? "text-green glow-green" : value >= 7 ? "text-amber glow-amber" : "text-red glow-red";
  return (
    <div className={`font-[family-name:var(--font-display)] text-xl font-bold ${color}`}>
      {value.toFixed(1)}
    </div>
  );
}

export function ResultBadge({ result }) {
  const type = result === "Win" ? "green" : result === "Draw" ? "amber" : "red";
  return <Badge type={type}>{result}</Badge>;
}

export function PercentileBlock({ label, val, text }) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-xs text-txt2 mb-1">
        <span>{label}</span>
        <span className="font-[family-name:var(--font-mono)] font-medium text-txt">{text}</span>
      </div>
      <div className="h-[3px] bg-bg4 rounded-sm">
        <div
          className="h-[3px] rounded-sm bg-green transition-all duration-500"
          style={{ width: `${val}%`, boxShadow: "0 0 6px rgba(0,230,118,0.3)" }}
        />
      </div>
    </div>
  );
}

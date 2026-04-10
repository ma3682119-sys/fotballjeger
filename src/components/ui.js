"use client";

const BADGE_STYLES = {
  green: "bg-green/10 text-green border border-green/15",
  amber: "bg-amber/10 text-amber border border-amber/15",
  red: "bg-red/10 text-red border border-red/15",
  purple: "bg-purple/10 text-purple border border-purple/15",
  blue: "bg-blue/10 text-blue border border-blue/15",
  gray: "bg-white/[0.04] text-txt2 border border-border",
  gold: "bg-gold/10 text-gold border border-gold/15",
};

export function Badge({ type = "gray", children }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] tracking-wide ${BADGE_STYLES[type] || BADGE_STYLES.gray}`}>
      {children}
    </span>
  );
}

export function StatGrid({ stats, cols = 4 }) {
  return (
    <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {stats.map((s, i) => (
        <div key={i} className="bg-white/[0.02] border border-border rounded-lg p-3 text-center">
          <div className="font-semibold text-lg leading-none" style={s.color ? { color: s.color } : {}}>
            {s.val}
          </div>
          <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-1 tracking-wide uppercase">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

const INSIGHT_BORDER = {
  green: "border-l-green/40",
  purple: "border-l-purple/40",
  amber: "border-l-amber/40",
  gold: "border-l-gold/40",
  red: "border-l-red/40",
};

export function Insight({ type = "green", children, className = "" }) {
  const textColor = type === "gold" ? "text-gold/80" : type === "red" ? "text-red/80" : "text-txt2";
  return (
    <div className={`text-[12px] ${textColor} rounded-md p-2.5 my-2 leading-relaxed border-l-2 bg-white/[0.02] ${INSIGHT_BORDER[type] || INSIGHT_BORDER.green} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="font-[family-name:var(--font-mono)] text-[10px] font-medium text-txt3 tracking-widest uppercase mt-5 mb-2 flex items-center gap-2">
      {children}
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export function PageTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-semibold text-txt tracking-tight">{children}</h1>
      {sub && <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-0.5 tracking-wide">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, color = "var(--color-green)", className = "" }) {
  return (
    <div className={`h-1 bg-white/[0.04] rounded-full my-1 ${className}`}>
      <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
    </div>
  );
}

export function Card({ children, className = "", glow, onClick }) {
  const glowBorder = glow === "gold" ? "border-gold/15" : glow === "red" ? "border-red/15" : glow === "purple" ? "border-purple/15" : "";
  return (
    <div className={`bg-white/[0.02] border border-border rounded-lg p-3.5 mb-2 transition-all hover:border-border2 ${glowBorder} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function GlowDot({ color = "var(--color-green)" }) {
  return <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}`, animation: "pulse-dot 2s infinite" }} />;
}

export function Dot({ type = "gray" }) {
  const colors = { green: "bg-green shadow-[0_0_4px_var(--color-green)]", red: "bg-red", gray: "bg-txt3", amber: "bg-amber" };
  return <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[type] || colors.gray}`} />;
}

export function Avatar({ initials, color = "green", size = 32 }) {
  const colors = { green: "bg-green/10 text-green", purple: "bg-purple/10 text-purple", amber: "bg-amber/10 text-amber", blue: "bg-blue/10 text-blue", red: "bg-red/10 text-red", gold: "bg-gold/10 text-gold" };
  return (
    <div className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${colors[color] || colors.green}`} style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

export function MiniChart({ data, colors, height = 32 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm min-h-[2px] transition-all duration-300" style={{ height: `${(v / max) * 100}%`, background: colors?.[i] || "var(--color-green)" }} />
      ))}
    </div>
  );
}

export function TagRow({ tags }) {
  return (
    <div className="flex gap-1 flex-wrap my-1">
      {tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-txt3 font-[family-name:var(--font-mono)]">{t}</span>)}
    </div>
  );
}

export function StepRow({ steps }) {
  return (
    <div>{steps.map((s, i) => (
      <div key={i} className="flex gap-2 py-1">
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: s.color }} />
          {i < steps.length - 1 && <div className="w-px flex-1 bg-border mx-[3px] min-h-[14px]" />}
        </div>
        <div>
          <div className="text-[12px] font-medium text-txt">{s.title}</div>
          <div className="text-[11px] text-txt2">{s.sub}</div>
          <span className="font-[family-name:var(--font-mono)] text-[9px] bg-amber/10 text-amber px-1.5 py-px rounded mt-0.5 inline-block">{s.deadline}</span>
        </div>
      </div>
    ))}</div>
  );
}

export function TrialDate({ month, day }) {
  return (
    <div className="text-[11px] font-semibold text-blue bg-blue/10 px-2 py-1 rounded-md text-center min-w-[40px] leading-tight shrink-0 border border-blue/10">
      {month}<br />{day}
    </div>
  );
}

export function CoachAlertPill({ name, weeksAgo }) {
  return (
    <div className="font-[family-name:var(--font-mono)] text-[10px] text-red bg-red/8 px-2 py-1 rounded-md mb-1.5 flex items-center gap-1.5 border border-red/10">
      <div className="w-1 h-1 rounded-full bg-red shrink-0" style={{ animation: "pulse-dot 2s infinite" }} />
      New coach: {name} · {weeksAgo}w ago
    </div>
  );
}

export function RatingDisplay({ value }) {
  const color = value >= 8 ? "text-green" : value >= 7 ? "text-amber" : "text-red";
  return <div className={`font-semibold text-lg ${color}`}>{value.toFixed(1)}</div>;
}

export function ResultBadge({ result }) {
  return <Badge type={result === "Win" ? "green" : result === "Draw" ? "amber" : "red"}>{result}</Badge>;
}

export function PercentileBlock({ label, val, text }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[12px] text-txt2 mb-0.5">
        <span>{label}</span>
        <span className="font-[family-name:var(--font-mono)] font-medium text-txt text-[11px]">{text}</span>
      </div>
      <div className="h-1 bg-white/[0.04] rounded-full">
        <div className="h-1 rounded-full bg-green transition-all duration-500" style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}

export function Btn({ children, variant = "default", onClick, disabled, className = "" }) {
  const styles = {
    green: "bg-green/10 text-green border-green/15 hover:bg-green/15",
    purple: "bg-purple/10 text-purple border-purple/15 hover:bg-purple/15",
    red: "border-red/15 text-red hover:bg-red/10",
    gold: "border-gold/15 text-gold hover:bg-gold/10",
    default: "border-border2 text-txt2 hover:bg-white/[0.04] hover:text-txt",
  };
  return (
    <button
      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all font-[family-name:var(--font-mono)] tracking-wide disabled:opacity-40 ${styles[variant] || styles.default} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

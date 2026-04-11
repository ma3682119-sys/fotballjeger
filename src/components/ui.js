"use client";

/* ── All colors reference the wes-dieleman dark warm palette ── */

const BADGE_STYLES = {
  green: "border border-[var(--color-green)]/15 text-[var(--color-green)]",
  amber: "border border-[var(--color-amber)]/15 text-[var(--color-amber)]",
  red: "border border-[var(--color-red)]/15 text-[var(--color-red)]",
  purple: "border border-[var(--color-purple)]/15 text-[var(--color-purple)]",
  blue: "border border-[var(--color-blue)]/15 text-[var(--color-blue)]",
  gray: "border text-[var(--color-text-secondary)]",
  gold: "border border-[var(--color-gold)]/15 text-[var(--color-gold)]",
};

export function Badge({ type = "gray", children }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide ${BADGE_STYLES[type] || BADGE_STYLES.gray}`}
      style={{
        fontFamily: "var(--font-mono)",
        background: type === "gray" ? "rgba(242,223,203,0.04)" : undefined,
        backgroundColor: type !== "gray" ? `color-mix(in srgb, var(--color-${type === "gold" ? "amber" : type}) 10%, transparent)` : undefined,
        borderColor: type === "gray" ? "var(--color-border-primary)" : undefined,
      }}
    >
      {children}
    </span>
  );
}

export function StatGrid({ stats, cols = 4 }) {
  return (
    <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {stats.map((s, i) => (
        <div key={i} className="text-center" style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border-primary)",
          borderRadius: 10,
          padding: "12px",
        }}>
          <div className="font-semibold text-lg leading-none" style={s.color ? { color: s.color } : { color: "var(--color-text-primary)" }}>
            {s.val}
          </div>
          <div className="mt-1 tracking-wide uppercase" style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--color-text-tertiary)",
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Insight({ type = "green", children, className = "" }) {
  const colors = {
    green: "var(--color-green)",
    purple: "var(--color-purple)",
    amber: "var(--color-amber)",
    gold: "var(--color-gold)",
    red: "var(--color-red)",
  };
  const c = colors[type] || colors.green;
  return (
    <div className={`my-2 leading-relaxed ${className}`} style={{
      fontSize: 12,
      color: type === "gold" || type === "red" ? c : "var(--color-text-secondary)",
      borderLeft: `2px solid ${c}`,
      background: "rgba(242,223,203,0.02)",
      borderRadius: 6,
      padding: "10px 12px",
      opacity: type === "gold" || type === "red" ? 0.9 : 0.8,
    }}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-2" style={{
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 500,
      color: "var(--color-text-tertiary)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    }}>
      {children}
      <span className="flex-1 h-px" style={{ background: "var(--color-border-primary)" }} />
    </div>
  );
}

export function PageTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--color-text-primary)" }}>{children}</h1>
      {sub && <p className="mt-0.5 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, color = "var(--color-green)", className = "" }) {
  return (
    <div className={`my-1 ${className}`} style={{ height: 4, background: "rgba(242,223,203,0.04)", borderRadius: 9999 }}>
      <div className="transition-all duration-500" style={{ height: 4, width: `${Math.min(value, 100)}%`, background: color, borderRadius: 9999 }} />
    </div>
  );
}

export function Card({ children, className = "", glow, onClick }) {
  const glowBorder = glow === "gold" ? "var(--color-gold)" : glow === "red" ? "var(--color-red)" : glow === "purple" ? "var(--color-purple)" : null;
  return (
    <div
      className={`mb-2 transition-all ${className}`}
      style={{
        background: "var(--color-bg-secondary)",
        border: `1px solid ${glowBorder ? `color-mix(in srgb, ${glowBorder} 20%, transparent)` : "var(--color-border-primary)"}`,
        borderRadius: 10,
        padding: "14px 16px",
        cursor: onClick ? "pointer" : undefined,
      }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.borderColor = glowBorder || "var(--color-border-secondary)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = glowBorder ? `color-mix(in srgb, ${glowBorder} 20%, transparent)` : "var(--color-border-primary)"}
    >
      {children}
    </div>
  );
}

export function GlowDot({ color = "var(--color-green)" }) {
  return <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}`, animation: "pulse-dot 2s infinite" }} />;
}

export function Dot({ type = "gray" }) {
  const colors = { green: "var(--color-green)", red: "var(--color-red)", gray: "var(--color-text-tertiary)", amber: "var(--color-amber)" };
  return <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: colors[type] || colors.gray }} />;
}

export function Avatar({ initials, color = "green", size = 32 }) {
  const colors = {
    green: { bg: "var(--color-green-dim)", text: "var(--color-green)" },
    purple: { bg: "var(--color-purple-dim)", text: "var(--color-purple)" },
    amber: { bg: "var(--color-amber-dim)", text: "var(--color-amber)" },
    blue: { bg: "var(--color-blue-dim)", text: "var(--color-blue)" },
    red: { bg: "var(--color-red-dim)", text: "var(--color-red)" },
    gold: { bg: "var(--color-gold-dim)", text: "var(--color-gold)" },
  };
  const c = colors[color] || colors.green;
  return (
    <div className="rounded-full flex items-center justify-center font-semibold shrink-0" style={{ width: size, height: size, fontSize: size * 0.35, background: c.bg, color: c.text }}>
      {initials}
    </div>
  );
}

export function MiniChart({ data, colors, height = 32 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-px" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm min-h-[2px] transition-all duration-300" style={{ height: `${(v / max) * 100}%`, background: colors?.[i] || "var(--color-accent)" }} />
      ))}
    </div>
  );
}

export function TagRow({ tags }) {
  return (
    <div className="flex gap-1 flex-wrap my-1">
      {tags.map(t => (
        <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(242,223,203,0.04)", color: "var(--color-text-tertiary)" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function StepRow({ steps }) {
  return (
    <div>{steps.map((s, i) => (
      <div key={i} className="flex gap-2 py-1">
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: s.color }} />
          {i < steps.length - 1 && <div className="w-px flex-1 mx-[3px] min-h-[14px]" style={{ background: "var(--color-border-primary)" }} />}
        </div>
        <div>
          <div className="text-[12px] font-medium" style={{ color: "var(--color-text-primary)" }}>{s.title}</div>
          <div className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>{s.sub}</div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: "var(--color-amber-dim)", color: "var(--color-amber)", padding: "1px 6px", borderRadius: 4, marginTop: 2, display: "inline-block" }}>{s.deadline}</span>
        </div>
      </div>
    ))}</div>
  );
}

export function TrialDate({ month, day }) {
  return (
    <div className="text-center shrink-0" style={{
      fontSize: 11, fontWeight: 600, color: "var(--color-blue)", background: "var(--color-blue-dim)",
      padding: "4px 8px", borderRadius: 8, minWidth: 40, lineHeight: 1.3, border: "1px solid rgba(90,143,224,0.1)",
    }}>
      {month}<br />{day}
    </div>
  );
}

export function CoachAlertPill({ name, weeksAgo }) {
  return (
    <div className="flex items-center gap-1.5 mb-1.5" style={{
      fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-red)", background: "var(--color-red-dim)",
      padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(212,90,90,0.1)",
    }}>
      <div className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--color-red)", animation: "pulse-dot 2s infinite" }} />
      New coach: {name} · {weeksAgo}w ago
    </div>
  );
}

export function RatingDisplay({ value }) {
  const c = value >= 8 ? "var(--color-green)" : value >= 7 ? "var(--color-amber)" : "var(--color-red)";
  return <div className="font-semibold text-lg" style={{ color: c }}>{value.toFixed(1)}</div>;
}

export function ResultBadge({ result }) {
  return <Badge type={result === "Win" ? "green" : result === "Draw" ? "amber" : "red"}>{result}</Badge>;
}

export function PercentileBlock({ label, val, text }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-0.5" style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--color-text-primary)", fontSize: 11 }}>{text}</span>
      </div>
      <ProgressBar value={val} />
    </div>
  );
}

export function Btn({ children, variant = "default", onClick, disabled, className = "" }) {
  const styles = {
    green: { bg: "var(--color-green-dim)", color: "var(--color-green)", border: "rgba(76,163,103,0.15)" },
    purple: { bg: "var(--color-purple-dim)", color: "var(--color-purple)", border: "rgba(159,113,223,0.15)" },
    red: { bg: "transparent", color: "var(--color-red)", border: "rgba(212,90,90,0.15)" },
    gold: { bg: "transparent", color: "var(--color-gold)", border: "rgba(224,168,64,0.15)" },
    default: { bg: "transparent", color: "var(--color-text-secondary)", border: "var(--color-border-secondary)" },
  };
  const s = styles[variant] || styles.default;
  return (
    <button
      className={`transition-all disabled:opacity-40 ${className}`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        letterSpacing: "0.02em",
        cursor: disabled ? "default" : "pointer",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

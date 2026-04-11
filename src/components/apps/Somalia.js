"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, Insight, GlowDot, Card, Btn } from "@/components/ui";
import { SOMALIA_TIMELINE, ELIGIBILITY } from "@/store/data";

const SC = { now: "var(--color-green)", next: "var(--color-purple)", future: "var(--color-text-tertiary)", dream: "var(--color-gold)" };
const SL = { now: "Now", next: "Next", future: "Future", dream: "Dream" };

export default function SomaliaApp() {
  const [declared, setDeclared] = useState(false);
  const capsLeft = ELIGIBILITY.maxAllowedBefore21 - ELIGIBILITY.norwayCompetitiveCaps;

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>Somalia Pipeline</h2>
      <p className="mb-4 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>ELIGIBILITY ENGINE · FIFA TRACKER</p>

      <StatGrid cols={3} stats={[
        { val: ELIGIBILITY.norwayCompetitiveCaps, label: "Norway caps", color: "var(--color-green)" },
        { val: capsLeft, label: "Before lock" },
        { val: declared ? "Declared" : "Pending", label: "Status", color: declared ? "var(--color-green)" : "var(--color-amber)" },
      ]} />

      <Card className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <GlowDot color="var(--color-green)" />
          <div>
            <div className="text-[13px] font-medium" style={{ color: "var(--color-text-primary)" }}>Eligibility — fully clean</div>
            <div className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>Zero competitive caps. Free to declare.</div>
          </div>
        </div>
        <Insight type="green">Youth caps (U17/U19) do NOT affect eligibility. Never accept a senior competitive cap for Norway.</Insight>
        {!declared
          ? <Btn variant="green" className="mt-2" onClick={() => setDeclared(true)}>Declare for Somalia</Btn>
          : <div className="mt-2" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-green)" }}>Declaration logged.</div>
        }
      </Card>

      <SectionLabel>Career roadmap</SectionLabel>
      {SOMALIA_TIMELINE.map((step, i) => (
        <div key={i} className="flex gap-2.5 mb-0">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              border: `1px solid ${SC[step.status]}`,
              color: SC[step.status],
              background: step.status === "now" ? "var(--color-green-dim)" : step.status === "next" ? "var(--color-purple-dim)" : step.status === "dream" ? "var(--color-gold-dim)" : "rgba(242,223,203,0.02)",
            }}>{step.age}</div>
            {i < SOMALIA_TIMELINE.length - 1 && <div className="w-px flex-1 min-h-[16px] my-0.5" style={{ background: "var(--color-border-primary)" }} />}
          </div>
          <div className="pb-3 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] font-medium" style={{ color: "var(--color-text-primary)" }}>{step.label}</span>
              <span className="px-1 py-px rounded" style={{ fontFamily: "var(--font-mono)", fontSize: 9, background: `color-mix(in srgb, ${SC[step.status]} 10%, transparent)`, color: SC[step.status] }}>{step.year} · {SL[step.status]}</span>
            </div>
            <div className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{step.desc}</div>
          </div>
        </div>
      ))}

      <SectionLabel>Realistic ceiling</SectionLabel>
      <Card glow="gold">
        <div className="grid grid-cols-2 gap-2">
          {[{ l: "AFCON qual", p: "Realistic", c: "var(--color-green)" }, { l: "AFCON tournament", p: "Achievable", c: "var(--color-green)" }, { l: "World Cup qual", p: "Dream", c: "var(--color-gold)" }, { l: "Euro transfer", p: "Post-tourney", c: "var(--color-purple)" }].map(x => (
            <div key={x.l} className="text-center" style={{ background: "rgba(242,223,203,0.02)", border: "1px solid var(--color-border-primary)", borderRadius: 8, padding: 8 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-tertiary)" }}>{x.l}</div>
              <div className="text-[13px] font-semibold" style={{ color: x.c }}>{x.p}</div>
            </div>
          ))}
        </div>
        <Insight type="gold" className="mt-2">If Somalia qualifies for the World Cup — clubs come looking for you. Atletico, Dortmund, Brentford. Built from day one.</Insight>
      </Card>
    </div>
  );
}

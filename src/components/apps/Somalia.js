"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, Badge, Insight, GlowDot, Card, Btn } from "@/components/ui";
import { SOMALIA_TIMELINE, ELIGIBILITY } from "@/store/data";

const SC = { now: "var(--color-green)", next: "var(--color-purple)", future: "var(--color-txt3)", dream: "var(--color-gold)" };
const SL = { now: "Now", next: "Next", future: "Future", dream: "Dream" };
const CSS = { now: "text-green border-green bg-green/10", next: "text-purple border-purple bg-purple/10", future: "text-txt3 border-txt3/30 bg-white/[0.02]", dream: "text-gold border-gold bg-gold/10" };

export default function SomaliaApp() {
  const [declared, setDeclared] = useState(false);
  const capsLeft = ELIGIBILITY.maxAllowedBefore21 - ELIGIBILITY.norwayCompetitiveCaps;

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5">Somalia Pipeline</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">ELIGIBILITY ENGINE · FIFA TRACKER</p>

      <StatGrid cols={3} stats={[
        { val: ELIGIBILITY.norwayCompetitiveCaps, label: "Norway caps", color: "var(--color-green)" },
        { val: capsLeft, label: "Before lock" },
        { val: declared ? "Declared" : "Pending", label: "Status", color: declared ? "var(--color-green)" : "var(--color-amber)" },
      ]} />

      <Card className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <GlowDot color="var(--color-green)" />
          <div><div className="text-[13px] font-medium">Eligibility — fully clean</div><div className="text-[11px] text-txt2">Zero competitive caps. Free to declare.</div></div>
        </div>
        <Insight type="green">Youth caps (U17/U19) do NOT affect eligibility. Never accept a senior competitive cap for Norway.</Insight>
        {!declared ? <Btn variant="green" className="mt-2" onClick={() => setDeclared(true)}>Declare for Somalia</Btn> : <div className="font-[family-name:var(--font-mono)] text-[10px] text-green mt-2">✓ Declaration logged.</div>}
      </Card>

      <SectionLabel>Career roadmap</SectionLabel>
      {SOMALIA_TIMELINE.map((step, i) => (
        <div key={i} className="flex gap-2.5 mb-0">
          <div className="flex flex-col items-center shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-[family-name:var(--font-mono)] text-[10px] border ${CSS[step.status]}`}>{step.age}</div>
            {i < SOMALIA_TIMELINE.length - 1 && <div className="w-px flex-1 bg-border min-h-[16px] my-0.5" />}
          </div>
          <div className="pb-3 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] font-medium">{step.label}</span>
              <span className="font-[family-name:var(--font-mono)] text-[9px] px-1 py-px rounded" style={{ background: `${SC[step.status]}15`, color: SC[step.status] }}>{step.year} · {SL[step.status]}</span>
            </div>
            <div className="text-[11px] text-txt2 leading-relaxed">{step.desc}</div>
          </div>
        </div>
      ))}

      <SectionLabel>Realistic ceiling</SectionLabel>
      <Card glow="gold">
        <div className="grid grid-cols-2 gap-2">
          {[{ l: "AFCON qual", p: "Realistic", c: "var(--color-green)" }, { l: "AFCON tournament", p: "Achievable", c: "var(--color-green)" }, { l: "World Cup qual", p: "Dream", c: "var(--color-gold)" }, { l: "Euro transfer", p: "Post-tourney", c: "var(--color-purple)" }].map(x => (
            <div key={x.l} className="bg-white/[0.02] border border-border rounded-md p-2 text-center">
              <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3">{x.l}</div>
              <div className="text-[13px] font-semibold" style={{ color: x.c }}>{x.p}</div>
            </div>
          ))}
        </div>
        <Insight type="gold" className="mt-2">If Somalia qualifies for the World Cup — clubs come looking for you. Atletico, Dortmund, Brentford. Built from day one.</Insight>
      </Card>
    </div>
  );
}

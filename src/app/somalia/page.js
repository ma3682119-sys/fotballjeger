"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, PageTitle, Badge, Insight, GlowDot, Card } from "@/components/ui";
import { SOMALIA_TIMELINE, ELIGIBILITY } from "@/store/data";

const STATUS_COLORS = { now: "var(--color-green)", next: "var(--color-purple)", future: "var(--color-txt3)", dream: "var(--color-gold)" };
const STATUS_LABELS = { now: "Now", next: "Next", future: "Future", dream: "Dream" };
const STATUS_CSS = { now: "text-green border-green bg-green-dim", next: "text-purple border-purple bg-purple-dim", future: "text-txt3 border-txt3 bg-bg3", dream: "text-gold border-gold bg-gold-dim" };

export default function Somalia() {
  const [declared, setDeclared] = useState(false);
  const elig = ELIGIBILITY;
  const capsLeft = elig.maxAllowedBefore21 - elig.norwayCompetitiveCaps;

  return (
    <div>
      <PageTitle sub="ELIGIBILITY ENGINE · FIFA REGULATION TRACKER · NATIONAL TEAM PIPELINE">Somalia pipeline</PageTitle>

      <StatGrid cols={3} stats={[
        { val: elig.norwayCompetitiveCaps, label: "Norway comp caps", color: elig.norwayCompetitiveCaps > 0 ? "var(--color-red)" : "var(--color-green)" },
        { val: capsLeft, label: "Caps left before lock" },
        { val: declared ? "Declared" : "Pending", label: "Somalia status", color: declared ? "var(--color-green)" : "var(--color-amber)" },
      ]} />

      <Card glow={elig.norwayCompetitiveCaps === 0 ? undefined : "red"} className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <GlowDot color={elig.norwayCompetitiveCaps === 0 ? "var(--color-green)" : "var(--color-red)"} />
          <div>
            <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">
              Eligibility status — {elig.norwayCompetitiveCaps === 0 ? "fully clean" : "monitor carefully"}
            </div>
            <div className="text-xs text-txt2">
              Zero competitive caps for Norway. You can declare for Somalia right now and it is permanently locked.
            </div>
          </div>
        </div>
        <Insight type="green">
          KEY RULE: You can play Norway youth football (U17, U19) freely — youth caps do NOT affect eligibility. Never accept a senior competitive cap for Norway. One wrong cap and Somalia is gone permanently.
        </Insight>
        {!declared ? (
          <div className="mt-2.5">
            <button
              className="text-[11px] px-4 py-2 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]"
              onClick={() => setDeclared(true)}
            >
              DECLARE FOR SOMALIA — LOCK IT IN
            </button>
          </div>
        ) : (
          <div className="font-[family-name:var(--font-mono)] text-[11px] text-green glow-green mt-2.5">
            ✓ Somalia declaration logged. Your intention is recorded.
          </div>
        )}
      </Card>

      <SectionLabel>Career roadmap to AFCON and beyond</SectionLabel>
      {SOMALIA_TIMELINE.map((step, i) => (
        <div key={i} className="flex gap-3 mb-0">
          <div className="flex flex-col items-center shrink-0">
            <div className={`
              w-8 h-8 rounded-full shrink-0 flex items-center justify-center
              font-[family-name:var(--font-mono)] text-[10px] border
              ${STATUS_CSS[step.status]}
            `}>
              {step.age}
            </div>
            {i < SOMALIA_TIMELINE.length - 1 && (
              <div className="w-px flex-1 bg-border min-h-[20px] my-1" />
            )}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{step.label}</div>
              <span className="font-[family-name:var(--font-mono)] text-[10px] px-1.5 py-px rounded" style={{
                background: `${STATUS_COLORS[step.status]}18`,
                color: STATUS_COLORS[step.status],
              }}>
                {step.year} · {STATUS_LABELS[step.status]}
              </span>
            </div>
            <div className="text-xs text-txt2 leading-relaxed">{step.desc}</div>
          </div>
        </div>
      ))}

      <SectionLabel>The realistic ceiling</SectionLabel>
      <Card glow="gold">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "AFCON qualification", prob: "Realistic", color: "var(--color-green)" },
            { label: "AFCON tournament", prob: "Achievable", color: "var(--color-green)" },
            { label: "World Cup qualification", prob: "Dream goal", color: "var(--color-gold)" },
            { label: "European club transfer", prob: "Post-tournament", color: "var(--color-purple)" },
          ].map(item => (
            <div key={item.label} className="bg-bg3 border border-border rounded-lg p-3 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/20" />
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1">{item.label}</div>
              <div className="font-[family-name:var(--font-display)] text-sm font-bold" style={{ color: item.color }}>{item.prob}</div>
            </div>
          ))}
        </div>
        <Insight type="gold" className="mt-2.5">
          If Somalia qualifies for the World Cup and you perform — you are not looking for clubs. Clubs are looking for you. Atletico, Marseille, Dortmund, Brentford. The system built this from day one.
        </Insight>
      </Card>
    </div>
  );
}

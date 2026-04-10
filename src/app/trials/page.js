"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, PageTitle, Badge, TrialDate, Card } from "@/components/ui";
import { TRIALS } from "@/store/data";

const SOURCES = ["football.no", "Club websites", "Facebook groups", "NFF bulletin", "Google search"];

export default function TrialsRadar() {
  const [trials, setTrials] = useState(TRIALS);

  useEffect(() => {
    fetch("/api/trials").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setTrials(d); }).catch(() => {});
  }, []);

  const toggleApply = (id) => {
    setTrials(prev => prev.map(t => t.id === id ? { ...t, applied: true } : t));
  };

  return (
    <div>
      <PageTitle sub="AUTO-SCANNING 5 SOURCES · UPDATED EVERY 4 MINUTES">Trials radar</PageTitle>

      <StatGrid stats={[
        { val: trials.length, label: "Trials found" },
        { val: trials.filter(t => t.applied).length, label: "Applied" },
        { val: "4 min ago", label: "Last scan" },
        { val: SOURCES.length, label: "Sources active" },
      ]} />

      <SectionLabel>Active sources</SectionLabel>
      <Card className="mb-5">
        <div className="flex gap-1.5 flex-wrap">
          {SOURCES.map(s => (
            <div key={s} className="flex items-center gap-1.5 bg-bg3 px-2.5 py-1 rounded-full border border-border">
              <div className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_4px_var(--color-green)] animate-pulse-glow" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-txt2">{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <SectionLabel>Upcoming trials</SectionLabel>
      {trials.map(t => (
        <Card key={t.id}>
          <div className="flex items-center gap-3">
            <TrialDate month={t.month} day={t.day} />
            <div className="flex-1 min-w-0">
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{t.name}</div>
              <div className="text-xs text-txt2">{t.sub}</div>
            </div>
            {t.applied ? (
              <Badge type="green">APPLIED</Badge>
            ) : (
              <button
                className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition shrink-0 font-[family-name:var(--font-mono)]"
                onClick={() => toggleApply(t.id)}
              >
                APPLY
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, Badge, TrialDate, Card, Btn } from "@/components/ui";
import { TRIALS } from "@/store/data";

const SOURCES = ["football.no", "Club websites", "Facebook", "NFF bulletin", "Google"];

export default function TrialsApp() {
  const [trials, setTrials] = useState(TRIALS);
  useEffect(() => { fetch("/api/trials").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setTrials(d); }).catch(() => {}); }, []);

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>Trials Radar</h2>
      <p className="mb-4 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>AUTO-SCANNING · 5 SOURCES</p>

      <StatGrid stats={[
        { val: trials.length, label: "Found" },
        { val: trials.filter(t => t.applied).length, label: "Applied" },
        { val: "4m ago", label: "Last scan" },
        { val: SOURCES.length, label: "Sources" },
      ]} />

      <SectionLabel>Active sources</SectionLabel>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {SOURCES.map(s => (
          <div key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ background: "rgba(242,223,203,0.03)", border: "1px solid var(--color-border-primary)", fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
            <div className="w-1 h-1 rounded-full" style={{ background: "var(--color-green)", animation: "pulse-dot 2s infinite" }} />
            {s}
          </div>
        ))}
      </div>

      <SectionLabel>Upcoming trials</SectionLabel>
      {trials.map(t => (
        <Card key={t.id}>
          <div className="flex items-center gap-2.5">
            <TrialDate month={t.month} day={t.day} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-primary)" }}>{t.name}</div>
              <div className="text-[11px] truncate" style={{ color: "var(--color-text-secondary)" }}>{t.sub}</div>
            </div>
            {t.applied ? <Badge type="green">Applied</Badge> : <Btn variant="green" onClick={() => setTrials(p => p.map(x => x.id === t.id ? { ...x, applied: true } : x))}>Apply</Btn>}
          </div>
        </Card>
      ))}
    </div>
  );
}

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
      <h2 className="text-base font-semibold mb-0.5">Trials Radar</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">AUTO-SCANNING · 5 SOURCES</p>

      <StatGrid stats={[
        { val: trials.length, label: "Found" },
        { val: trials.filter(t => t.applied).length, label: "Applied" },
        { val: "4m ago", label: "Last scan" },
        { val: SOURCES.length, label: "Sources" },
      ]} />

      <SectionLabel>Active sources</SectionLabel>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {SOURCES.map(s => (
          <div key={s} className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded-full border border-border text-[10px] text-txt2 font-[family-name:var(--font-mono)]">
            <div className="w-1 h-1 rounded-full bg-green" style={{ animation: "pulse-dot 2s infinite" }} />
            {s}
          </div>
        ))}
      </div>

      <SectionLabel>Upcoming trials</SectionLabel>
      {trials.map(t => (
        <Card key={t.id}>
          <div className="flex items-center gap-2.5">
            <TrialDate month={t.month} day={t.day} />
            <div className="flex-1 min-w-0"><div className="text-[13px] font-medium truncate">{t.name}</div><div className="text-[11px] text-txt2 truncate">{t.sub}</div></div>
            {t.applied ? <Badge type="green">Applied</Badge> : <Btn variant="green" onClick={() => setTrials(p => p.map(x => x.id === t.id ? { ...x, applied: true } : x))}>Apply</Btn>}
          </div>
        </Card>
      ))}
    </div>
  );
}

"use client";
import { useState, useEffect, useMemo } from "react";
import { StatGrid, Insight, SectionLabel, Badge, GlowDot, Card, Btn } from "@/components/ui";
import { PATHWAYS, INBOX, TRIALS, MATCHES } from "@/store/data";

export default function OverviewApp() {
  const [matches] = useState(MATCHES);
  const topPath = PATHWAYS.find(p => p.rank === 1);
  const pending = TRIALS.filter(t => !t.applied).length;
  const interested = INBOX.filter(i => i.status === "green").length;

  const stats = useMemo(() => {
    if (!matches.length) return null;
    const avgRating = +(matches.reduce((s, m) => s + m.rating, 0) / matches.length).toFixed(1);
    const wins = matches.filter(m => m.result === "Win").length;
    const draws = matches.filter(m => m.result === "Draw").length;
    const losses = matches.filter(m => m.result === "Loss").length;
    const byPos = {};
    matches.forEach(m => { if (!byPos[m.pos]) byPos[m.pos] = []; byPos[m.pos].push(m.rating); });
    const bestPos = Object.entries(byPos).sort((a, b) => b[1].reduce((x, y) => x + y, 0) / b[1].length - a[1].reduce((x, y) => x + y, 0) / a[1].length)[0]?.[0] || "LM";
    const r3 = matches.slice(0, 3).map(m => m.rating);
    const o3 = matches.slice(3, 6).map(m => m.rating);
    const trend = r3.reduce((a, b) => a + b, 0) / 3 > (o3.length ? o3.reduce((a, b) => a + b, 0) / 3 : 7) + 0.3 ? "up" : "stable";
    return { avgRating, wins, draws, losses, bestPos, trend };
  }, [matches]);

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5">Good evening —</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">ALL SYSTEMS ONLINE · 5 SOURCES ACTIVE</p>

      <StatGrid stats={[
        { val: interested, label: "Interested", color: "var(--color-green)" },
        { val: INBOX.length, label: "Emails sent" },
        { val: `${TRIALS.length}`, label: "Trials found", color: "var(--color-purple)" },
        { val: stats?.avgRating ?? "—", label: "Avg rating" },
      ]} />

      <Insight type="gold">◆ Goldmine alert — Kjelsås G17 hired a new coach 3 weeks ago. New coaches want their own players. Email today.</Insight>

      <SectionLabel>This week</SectionLabel>
      <Card>
        <div className="flex items-center justify-between">
          <div><div className="text-[13px] font-medium">Trial — Lyn FK G17</div><div className="text-[11px] text-txt2">Mon Apr 14 · Bislett · 4.3km</div></div>
          <Badge type="green">Confirmed</Badge>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div><div className="text-[13px] font-medium">Follow up — Grei FK</div><div className="text-[11px] text-txt2">No reply in 10 days</div></div>
          <Btn variant="green">Send follow-up</Btn>
        </div>
      </Card>
      {pending > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div><div className="text-[13px] font-medium">{pending} trials pending</div><div className="text-[11px] text-txt2">Skeid, Frigg, Kjelsås...</div></div>
            <Btn variant="purple">Review all</Btn>
          </div>
        </Card>
      )}

      {topPath && (<>
        <SectionLabel>Top pathway</SectionLabel>
        <Card glow="gold">
          <div className="flex items-start justify-between mb-1">
            <div><Badge type="gold">Goldmine #1</Badge><div className="text-[13px] font-medium mt-1">{topPath.title}</div></div>
            <div className="text-right shrink-0"><div className="text-xl font-bold text-gold glow-gold">{topPath.successRate}%</div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3">success rate</div></div>
          </div>
          <Insight type="gold">{topPath.insight}</Insight>
        </Card>
      </>)}

      <SectionLabel>Eligibility</SectionLabel>
      <Card>
        <div className="flex items-center gap-2.5">
          <GlowDot color="var(--color-green)" />
          <div className="flex-1"><div className="text-[13px] font-medium">Somalia — fully eligible</div><div className="text-[11px] text-txt2">Zero competitive caps for Norway.</div></div>
          <Badge type="green">Protected</Badge>
        </div>
      </Card>

      {stats && (<>
        <SectionLabel>Performance</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: stats.bestPos, label: "Best pos" },
            { val: `${stats.wins}W ${stats.draws}D ${stats.losses}L`, label: "Record" },
            { val: stats.trend === "up" ? "↑ Rising" : "→ Stable", label: "Form", color: stats.trend === "up" ? "var(--color-green)" : undefined },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-border rounded-lg p-2.5 text-center">
              <div className="font-semibold text-sm" style={s.color ? { color: s.color } : {}}>{s.val}</div>
              <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

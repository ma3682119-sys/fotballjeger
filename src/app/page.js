"use client";
import { useState, useEffect, useMemo } from "react";
import { StatGrid, Insight, SectionLabel, PageTitle, Badge, GlowDot, Card } from "@/components/ui";
import { PATHWAYS, ELIGIBILITY, INBOX, TRIALS, MATCHES } from "@/store/data";

function useMatchStats(matches) {
  return useMemo(() => {
    if (!matches.length) return null;
    const avgRating = matches.reduce((s, m) => s + m.rating, 0) / matches.length;
    const wins = matches.filter(m => m.result === "Win").length;
    const draws = matches.filter(m => m.result === "Draw").length;
    const losses = matches.filter(m => m.result === "Loss").length;
    const byPos = {};
    matches.forEach(m => {
      if (!byPos[m.pos]) byPos[m.pos] = { ratings: [] };
      byPos[m.pos].ratings.push(m.rating);
    });
    const posBreakdown = Object.entries(byPos).map(([pos, d]) => ({
      pos, avgRating: d.ratings.reduce((a, b) => a + b, 0) / d.ratings.length,
    })).sort((a, b) => b.avgRating - a.avgRating);
    const bestPos = posBreakdown[0]?.pos ?? "LM";
    const recent3 = matches.slice(0, 3).map(m => m.rating);
    const older3 = matches.slice(3, 6).map(m => m.rating);
    const recentAvg = recent3.reduce((a, b) => a + b, 0) / recent3.length;
    const olderAvg = older3.length ? older3.reduce((a, b) => a + b, 0) / older3.length : recentAvg;
    const trend = recentAvg > olderAvg + 0.3 ? "up" : recentAvg < olderAvg - 0.3 ? "down" : "stable";
    return { avgRating: +avgRating.toFixed(1), wins, draws, losses, bestPos, trend };
  }, [matches]);
}

export default function Overview() {
  const [matches, setMatches] = useState(MATCHES);
  const inbox = INBOX;
  const trials = TRIALS;
  const topPath = PATHWAYS.find(p => p.rank === 1);
  const pending = trials.filter(t => !t.applied).length;
  const interested = inbox.filter(i => i.status === "green").length;
  const stats = useMatchStats(matches);

  useEffect(() => {
    fetch("/api/matches").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setMatches(d); }).catch(() => {});
  }, []);

  return (
    <div>
      <PageTitle sub="SYSTEM STATUS: OPERATIONAL · ALL SCANNERS ACTIVE">
        Good evening —
      </PageTitle>

      <StatGrid stats={[
        { val: interested, label: "Interested", color: "var(--color-green)" },
        { val: inbox.length, label: "Emails sent" },
        { val: `${trials.length} found`, label: "Trials radar", color: "var(--color-purple)" },
        { val: stats?.avgRating ?? "—", label: "Avg rating" },
      ]} />

      <Insight type="gold">
        ◆ GOLDMINE ALERT — Kjelsås G17 hired a new coach 3 weeks ago. New coaches almost always want their own players. This is your highest-value window right now. Email today.
      </Insight>

      <SectionLabel>This week</SectionLabel>

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">Trial — Lyn FK G17</div>
            <div className="text-xs text-txt2">Mon Apr 14 · Bislett · 4.3km</div>
          </div>
          <Badge type="green">CONFIRMED</Badge>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">Follow up — Grei FK</div>
            <div className="text-xs text-txt2">No reply in 10 days · Auto-draft ready</div>
          </div>
          <button className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
            SEND FOLLOW-UP
          </button>
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">Log match — vs Skeid G17</div>
            <div className="text-xs text-txt2">Apr 5 result not logged yet</div>
          </div>
          <button className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 hover:text-txt transition font-[family-name:var(--font-mono)]">
            LOG NOW
          </button>
        </div>
      </Card>
      {pending > 0 && (
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{pending} trials pending application</div>
              <div className="text-xs text-txt2">Skeid, Frigg, Kjelsås...</div>
            </div>
            <button className="text-[11px] px-3 py-1.5 rounded-lg bg-purple-dim text-purple border border-purple/25 hover:bg-purple/20 transition font-[family-name:var(--font-mono)]">
              REVIEW ALL
            </button>
          </div>
        </Card>
      )}

      <SectionLabel>Top pathway right now</SectionLabel>
      {topPath && (
        <Card glow="gold">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Badge type="gold">GOLDMINE #1</Badge>
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium mt-1.5">{topPath.title}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-[family-name:var(--font-display)] text-[26px] font-extrabold glow-gold">{topPath.successRate}%</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">success rate</div>
            </div>
          </div>
          <Insight type="gold">{topPath.insight}</Insight>
        </Card>
      )}

      <SectionLabel>Eligibility status</SectionLabel>
      <Card>
        <div className="flex items-center gap-3">
          <GlowDot color="var(--color-green)" />
          <div className="flex-1">
            <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">
              Somalia — fully eligible
            </div>
            <div className="text-xs text-txt2">
              Zero competitive caps for Norway. Clean. Declare for Somalia now and it's locked.
            </div>
          </div>
          <Badge type="green">PROTECTED</Badge>
        </div>
      </Card>

      {stats && (
        <>
          <SectionLabel>Performance snapshot</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-bg3 border border-border rounded-lg p-3 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green/20" />
              <div className="font-[family-name:var(--font-display)] text-base font-bold">{stats.bestPos}</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">Best position</div>
            </div>
            <div className="bg-bg3 border border-border rounded-lg p-3 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green/20" />
              <div className="font-[family-name:var(--font-display)] text-base font-bold">{stats.wins}W {stats.draws}D {stats.losses}L</div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">Record</div>
            </div>
            <div className="bg-bg3 border border-border rounded-lg p-3 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green/20" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green/20" />
              <div className={`font-[family-name:var(--font-display)] text-base font-bold ${stats.trend === "up" ? "text-green glow-green" : stats.trend === "down" ? "text-red" : ""}`}>
                {stats.trend === "up" ? "↑ rising" : stats.trend === "down" ? "↓ falling" : "→ stable"}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">Form trend</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

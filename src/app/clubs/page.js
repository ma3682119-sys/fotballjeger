"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, PageTitle, Badge, Insight, ProgressBar, TagRow, CoachAlertPill, Card } from "@/components/ui";
import { CLUBS } from "@/store/data";

export default function ClubScouting() {
  const [clubs, setClubs] = useState(CLUBS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/clubs").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setClubs(d); }).catch(() => {});
  }, []);

  const filtered = clubs.filter(c => {
    if (filter === "goldmine") return c.goldmine;
    if (filter === "alert") return !!c.coachAlert;
    if (filter === "avoid") return c.avoid;
    return true;
  });

  const alerts = clubs.filter(c => c.coachAlert).length;

  return (
    <div>
      <PageTitle sub="SCANNING 5 CLUBS · OSLO REGION · AUTO-UPDATE ENABLED">Club scouting</PageTitle>

      <StatGrid stats={[
        { val: clubs.length, label: "Clubs scanned" },
        { val: clubs.filter(c => c.pathScore >= 70).length, label: "High value" },
        { val: `${(clubs.reduce((s, c) => s + c.distance, 0) / clubs.length).toFixed(1)}km`, label: "Avg distance" },
        { val: alerts, label: "Coach alerts", color: alerts > 0 ? "var(--color-red)" : undefined },
      ]} />

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[["all", "ALL CLUBS"], ["goldmine", "◆ GOLDMINE"], ["alert", "⚠ COACH ALERTS"], ["avoid", "✕ AVOID"]].map(([val, label]) => (
          <button
            key={val}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition font-[family-name:var(--font-mono)] ${
              filter === val
                ? "bg-purple-dim text-purple border-purple/25"
                : "border-border2 text-txt2 hover:bg-bg3 hover:text-txt"
            }`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {filtered.map(club => (
          <Card
            key={club.id}
            glow={club.goldmine ? "gold" : club.avoid ? "red" : undefined}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-[family-name:var(--font-display)] text-sm font-medium">{club.name}</div>
                <div className="text-xs text-txt2 font-[family-name:var(--font-mono)]">{club.distance}km away</div>
              </div>
              <Badge type={club.badgeType}>{club.badge?.toUpperCase()}</Badge>
            </div>

            {club.coachAlert && <CoachAlertPill name={club.coachAlert.name} weeksAgo={club.coachAlert.weeksAgo} />}

            <TagRow tags={club.tags} />

            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-2 mb-0.5 uppercase tracking-wider">&gt; Path score</div>
            <ProgressBar value={club.pathScore} color={club.pathScore >= 70 ? "var(--color-green)" : club.pathScore >= 50 ? "var(--color-amber)" : "var(--color-red)"} />
            <div className="font-[family-name:var(--font-display)] text-xl font-bold mb-1.5">{club.pathScore}</div>

            <Insight type={club.goldmine ? "gold" : club.avoid ? "red" : "green"}>{club.insight}</Insight>

            <div className="flex gap-1.5 mt-2.5 flex-wrap">
              {!club.avoid && (
                <button className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
                  SEND EMAIL
                </button>
              )}
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 hover:text-txt transition font-[family-name:var(--font-mono)]">
                VIEW CLUB
              </button>
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-red/25 text-red hover:bg-red-dim transition font-[family-name:var(--font-mono)]">
                SKIP
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

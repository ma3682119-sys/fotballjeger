"use client";
import { useState, useEffect } from "react";
import { StatGrid, SectionLabel, Badge, Insight, ProgressBar, TagRow, CoachAlertPill, Card, Btn } from "@/components/ui";
import { CLUBS } from "@/store/data";

export default function ClubsApp() {
  const [clubs, setClubs] = useState(CLUBS);
  const [filter, setFilter] = useState("all");
  useEffect(() => { fetch("/api/clubs").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setClubs(d); }).catch(() => {}); }, []);

  const filtered = clubs.filter(c => filter === "all" ? true : filter === "goldmine" ? c.goldmine : filter === "alert" ? !!c.coachAlert : c.avoid);

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>Club Scouting</h2>
      <p className="mb-4 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>SCANNING {clubs.length} CLUBS · OSLO REGION</p>

      <StatGrid stats={[
        { val: clubs.length, label: "Scanned" },
        { val: clubs.filter(c => c.pathScore >= 70).length, label: "High value" },
        { val: `${(clubs.reduce((s, c) => s + c.distance, 0) / clubs.length).toFixed(1)}km`, label: "Avg dist" },
        { val: clubs.filter(c => c.coachAlert).length, label: "Alerts", color: "var(--color-red)" },
      ]} />

      <div className="flex gap-1 mb-3 flex-wrap">
        {[["all", "All"], ["goldmine", "Goldmine"], ["alert", "Alerts"], ["avoid", "Avoid"]].map(([v, l]) => (
          <Btn key={v} variant={filter === v ? "purple" : "default"} onClick={() => setFilter(v)}>{l}</Btn>
        ))}
      </div>

      {filtered.map(club => (
        <Card key={club.id} glow={club.goldmine ? "gold" : club.avoid ? "red" : undefined}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--color-text-primary)" }}>{club.name}</div>
              <div className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-tertiary)" }}>{club.distance}km</div>
            </div>
            <Badge type={club.badgeType}>{club.badge}</Badge>
          </div>
          {club.coachAlert && <CoachAlertPill name={club.coachAlert.name} weeksAgo={club.coachAlert.weeksAgo} />}
          <TagRow tags={club.tags} />
          <div className="mt-1.5 mb-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-tertiary)" }}>PATH SCORE</div>
          <ProgressBar value={club.pathScore} color={club.pathScore >= 70 ? "var(--color-green)" : club.pathScore >= 50 ? "var(--color-amber)" : "var(--color-red)"} />
          <div className="font-semibold text-lg mb-1" style={{ color: "var(--color-text-primary)" }}>{club.pathScore}</div>
          <Insight type={club.goldmine ? "gold" : club.avoid ? "red" : "green"}>{club.insight}</Insight>
          <div className="flex gap-1 mt-2">
            {!club.avoid && <Btn variant="green">Send email</Btn>}
            <Btn>View</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}

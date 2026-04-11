"use client";
import { useState } from "react";
import { StatGrid, Badge, Insight, ProgressBar, TagRow, Avatar, Card, Btn } from "@/components/ui";
import { CONTACTS } from "@/store/data";

const TL = { coach_alert: "Alert", bridge: "Bridge", high_value: "High value", somalia_pipeline: "Somalia" };
const TC = { coach_alert: "red", bridge: "purple", high_value: "amber", somalia_pipeline: "gold" };

export default function NetworkApp() {
  const [filter, setFilter] = useState("all");
  const filtered = CONTACTS.filter(c => filter === "all" || c.type === filter);

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5" style={{ color: "var(--color-text-primary)" }}>Network</h2>
      <p className="mb-4 tracking-wide" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)" }}>OSLO FOOTBALL NETWORK</p>

      <StatGrid stats={[
        { val: CONTACTS.length, label: "Contacts" },
        { val: CONTACTS.filter(c => c.type === "bridge").length, label: "Bridges" },
        { val: CONTACTS.filter(c => c.type === "coach_alert").length, label: "Alerts", color: "var(--color-red)" },
        { val: CONTACTS.filter(c => c.somaliaLink).length, label: "Somalia", color: "var(--color-gold)" },
      ]} />

      <div className="flex gap-1 mb-3 flex-wrap">
        {[["all", "All"], ["coach_alert", "Alerts"], ["bridge", "Bridges"], ["somalia_pipeline", "Somalia"]].map(([v, l]) => (
          <Btn key={v} variant={filter === v ? "purple" : "default"} onClick={() => setFilter(v)}>{l}</Btn>
        ))}
      </div>

      {filtered.map(c => (
        <Card key={c.id} glow={c.type === "coach_alert" ? "red" : c.somaliaLink ? "gold" : undefined}>
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar initials={c.initials} color={c.avColor} />
            <div className="flex-1">
              <div className="text-[13px] font-medium" style={{ color: "var(--color-text-primary)" }}>{c.name}</div>
              <div className="text-[11px]" style={{ color: "var(--color-text-secondary)" }}>{c.role} · {c.club}</div>
            </div>
            <div className="text-right shrink-0">
              <Badge type={TC[c.type]}>{TL[c.type]}</Badge>
              {c.strength > 0 && <div className="w-14 ml-auto mt-1"><ProgressBar value={c.strength} color={`var(--color-${c.avColor})`} /></div>}
              <div className="mt-0.5" style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--color-text-tertiary)" }}>{c.lastContact}</div>
            </div>
          </div>
          <TagRow tags={c.tags} />
          {c.connection && <div className="my-1.5" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-tertiary)", borderLeft: "1px dashed var(--color-border-secondary)", paddingLeft: 8 }}>{c.connection}</div>}
          <Insight type={c.somaliaLink ? "gold" : c.type === "coach_alert" ? "red" : "purple"}>{c.insight}</Insight>
          <div className="flex gap-1 mt-2">
            {c.type === "coach_alert" && <Btn variant="green">Email now</Btn>}
            {c.type === "bridge" && <Btn variant="green">Follow up</Btn>}
            {c.somaliaLink && <Btn variant="gold">Contact</Btn>}
            <Btn>Add note</Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}

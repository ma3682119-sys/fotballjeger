"use client";
import { useState, useEffect } from "react";
import { StatGrid, PageTitle, Badge, Insight, ProgressBar, TagRow, Avatar, Card } from "@/components/ui";
import { CONTACTS } from "@/store/data";

const TYPE_LABELS = { coach_alert: "⚠ COACH ALERT", bridge: "◈ BRIDGE", high_value: "★ HIGH VALUE", somalia_pipeline: "◆ SOMALIA" };
const TYPE_COLORS = { coach_alert: "red", bridge: "purple", high_value: "amber", somalia_pipeline: "gold" };

export default function Network() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Could fetch from API if needed
  }, []);

  const filtered = contacts.filter(c => filter === "all" || c.type === filter);
  const alerts = contacts.filter(c => c.type === "coach_alert").length;
  const bridges = contacts.filter(c => c.type === "bridge").length;
  const somalia = contacts.filter(c => c.somaliaLink).length;

  return (
    <div>
      <PageTitle sub="MAPPING CONNECTIONS · OSLO FOOTBALL NETWORK">Network mapper</PageTitle>

      <StatGrid stats={[
        { val: contacts.length, label: "Contacts" },
        { val: bridges, label: "Bridge opps" },
        { val: alerts, label: "Coach alerts", color: alerts > 0 ? "var(--color-red)" : undefined },
        { val: somalia, label: "Somalia links", color: "var(--color-gold)" },
      ]} />

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {[["all", "ALL"], ["coach_alert", "⚠ ALERTS"], ["bridge", "◈ BRIDGES"], ["somalia_pipeline", "★ SOMALIA"]].map(([val, label]) => (
          <button
            key={val}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition font-[family-name:var(--font-mono)] ${
              filter === val ? "bg-purple-dim text-purple border-purple/25" : "border-border2 text-txt2 hover:bg-bg3 hover:text-txt"
            }`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.map(c => (
        <Card
          key={c.id}
          glow={c.type === "coach_alert" ? "red" : c.somaliaLink ? "gold" : undefined}
          className={c.type === "coach_alert" ? "border-l-2 !border-l-red" : ""}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar initials={c.initials} color={c.avColor} />
            <div className="flex-1">
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{c.name}</div>
              <div className="text-xs text-txt2">{c.role} · {c.club}</div>
            </div>
            <div className="text-right shrink-0">
              <Badge type={TYPE_COLORS[c.type]}>{TYPE_LABELS[c.type]}</Badge>
              {c.strength > 0 && (
                <div className="mt-1.5 w-[60px] ml-auto">
                  <ProgressBar value={c.strength} color={`var(--color-${c.avColor})`} />
                </div>
              )}
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-1">{c.lastContact}</div>
            </div>
          </div>

          <TagRow tags={c.tags} />

          {c.connection && (
            <div className="font-[family-name:var(--font-mono)] text-[11px] text-txt3 border-l border-dashed border-border2 pl-2.5 my-2">
              {c.connection}
            </div>
          )}

          <Insight type={c.somaliaLink ? "gold" : c.type === "coach_alert" ? "red" : "purple"}>
            {c.insight}
          </Insight>

          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {c.type === "coach_alert" && (
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
                EMAIL NOW
              </button>
            )}
            {c.type === "bridge" && (
              <button className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
                FOLLOW UP
              </button>
            )}
            {c.type === "high_value" && (
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 hover:text-txt transition font-[family-name:var(--font-mono)]">
                RESEARCH
              </button>
            )}
            {c.somaliaLink && (
              <button className="text-[11px] px-3 py-1.5 rounded-lg border border-gold/30 text-gold hover:bg-gold-dim transition font-[family-name:var(--font-mono)]">
                CONTACT
              </button>
            )}
            <button className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 hover:text-txt transition font-[family-name:var(--font-mono)]">
              ADD NOTE
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

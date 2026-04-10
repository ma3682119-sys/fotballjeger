"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, PageTitle, Insight, MiniChart, PercentileBlock, Card } from "@/components/ui";
import { PHYSICAL, PERCENTILES } from "@/store/data";

export default function Physical() {
  const [form, setForm] = useState({ height: "", weight: "", sprint: "", jump: "" });

  const metrics = [
    { key: "height", label: "Height", ...PHYSICAL.height },
    { key: "weight", label: "Weight", ...PHYSICAL.weight },
    { key: "sprint", label: "Sprint 40m", ...PHYSICAL.sprint },
    { key: "jump", label: "Vertical jump", ...PHYSICAL.jump },
  ];

  const toBarData = (arr) => {
    const mn = Math.min(...arr), mx = Math.max(...arr);
    if (mx === mn) return arr.map(() => 60);
    return arr.map(v => Math.round(((v - mn) / (mx - mn)) * 60 + 40));
  };

  return (
    <div>
      <PageTitle sub="BIOMETRIC TRACKING · AUTO-APPENDED TO OUTREACH EMAILS">Physical tracker</PageTitle>

      <Insight type="gold" className="mb-5">
        ◆ OUTREACH FLAG ACTIVE — "187cm, 16 years old, still developing" is auto-appended to all emails. Top 12% for Norwegian U17 midfielders. Genuine competitive edge.
      </Insight>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {metrics.map(m => (
          <Card key={m.key}>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1.5 uppercase tracking-wider">&gt; {m.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-display)] text-[28px] font-extrabold">{m.current}</span>
              <span className="text-[13px] text-txt2">{m.unit}</span>
            </div>
            <span className={`
              font-[family-name:var(--font-mono)] text-[10px] mt-1.5 px-2 py-0.5 rounded-md inline-block
              ${m.good === true ? "bg-green-dim text-green" : m.good === false ? "bg-red-dim text-red" : "bg-bg4 text-txt3"}
            `}>
              {m.delta}
            </span>
            <div className="mt-2">
              <MiniChart
                data={toBarData(m.history)}
                colors={m.history.map((_, i, arr) => i === arr.length - 1 ? m.color : `${m.color}55`)}
                height={28}
              />
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Norwegian U17 midfielder percentiles</SectionLabel>
      <Card>
        {PERCENTILES.map(p => (
          <PercentileBlock key={p.label} label={p.label} val={p.val} text={p.text} />
        ))}
      </Card>

      <SectionLabel>Log measurement</SectionLabel>
      <Card>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Height (cm)</div>
            <input type="number" placeholder="187" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Weight (kg)</div>
            <input type="number" placeholder="75" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Sprint 40m (s)</div>
            <input type="number" placeholder="5.1" value={form.sprint} onChange={e => setForm(f => ({ ...f, sprint: e.target.value }))} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Vertical jump (cm)</div>
            <input type="number" placeholder="58" value={form.jump} onChange={e => setForm(f => ({ ...f, jump: e.target.value }))} className="w-full" />
          </div>
        </div>
        <button className="text-[11px] px-4 py-2 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
          LOG MEASUREMENTS
        </button>
      </Card>

      <SectionLabel>Growth projection</SectionLabel>
      <Card glow="gold">
        <div className="font-[family-name:var(--font-display)] text-[13px] font-medium mb-1.5">Projected height at 18 — 188–190cm</div>
        <div className="text-xs text-txt2 leading-relaxed">
          At +0.5cm per 3 months you are still in an active growth phase. At 188–190cm in Norwegian div 4–5 midfield you become physically dominant in the air — very few midfielders at that level have this. System will automatically update outreach emphasis when you cross 188cm.
        </div>
      </Card>

      <SectionLabel>Somalia national team profile</SectionLabel>
      <Card glow="gold">
        <div className="font-[family-name:var(--font-display)] text-[13px] font-medium mb-2">Physical profile vs Somalia squad average</div>
        <div className="mb-2">
          <div className="flex justify-between text-xs text-txt2 mb-1">
            <span>Height vs squad avg (181cm)</span>
            <span className="font-[family-name:var(--font-mono)] font-medium text-gold">+6cm</span>
          </div>
          <div className="h-[3px] bg-bg4 rounded-sm">
            <div className="h-[3px] rounded-sm bg-gold" style={{ width: "92%", boxShadow: "0 0 6px rgba(255,215,0,0.3)" }} />
          </div>
        </div>
        <Insight type="gold" className="!mt-0">
          At your projected height you would be the physically dominant midfielder in Somalia's squad by a significant margin. Tangible competitive advantage for set pieces and aerial duels at international level.
        </Insight>
      </Card>
    </div>
  );
}

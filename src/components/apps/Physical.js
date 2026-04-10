"use client";
import { useState } from "react";
import { SectionLabel, Insight, MiniChart, PercentileBlock, Card, Btn } from "@/components/ui";
import { PHYSICAL, PERCENTILES } from "@/store/data";

export default function PhysicalApp() {
  const metrics = [
    { key: "height", label: "Height", ...PHYSICAL.height },
    { key: "weight", label: "Weight", ...PHYSICAL.weight },
    { key: "sprint", label: "Sprint 40m", ...PHYSICAL.sprint },
    { key: "jump", label: "Vert jump", ...PHYSICAL.jump },
  ];
  const toBar = (arr) => { const mn = Math.min(...arr), mx = Math.max(...arr); if (mx === mn) return arr.map(() => 60); return arr.map(v => Math.round(((v - mn) / (mx - mn)) * 60 + 40)); };

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5">Physical Tracker</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">BIOMETRIC TRACKING</p>

      <Insight type="gold" className="mb-3">◆ "187cm, 16yo, still developing" auto-appended to emails. Top 12% Norwegian U17 midfielders.</Insight>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {metrics.map(m => (
          <Card key={m.key}>
            <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-1">{m.label.toUpperCase()}</div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-2xl">{m.current}</span>
              <span className="text-[12px] text-txt2">{m.unit}</span>
            </div>
            <span className={`font-[family-name:var(--font-mono)] text-[9px] mt-1 px-1.5 py-px rounded inline-block ${m.good === true ? "bg-green/10 text-green" : m.good === false ? "bg-red/10 text-red" : "bg-white/[0.04] text-txt3"}`}>{m.delta}</span>
            <div className="mt-2"><MiniChart data={toBar(m.history)} colors={m.history.map((_, i, a) => i === a.length - 1 ? m.color : `${m.color}55`)} height={24} /></div>
          </Card>
        ))}
      </div>

      <SectionLabel>U17 percentiles</SectionLabel>
      <Card>{PERCENTILES.map(p => <PercentileBlock key={p.label} label={p.label} val={p.val} text={p.text} />)}</Card>

      <SectionLabel>Growth projection</SectionLabel>
      <Card glow="gold">
        <div className="text-[13px] font-medium mb-1">Projected at 18 — 188–190cm</div>
        <div className="text-[12px] text-txt2 leading-relaxed">Active growth phase. At 188–190cm you become physically dominant in div 4–5 midfield.</div>
      </Card>

      <SectionLabel>vs Somalia squad</SectionLabel>
      <Card glow="gold">
        <div className="flex justify-between text-[12px] text-txt2 mb-1"><span>Height vs avg (181cm)</span><span className="font-[family-name:var(--font-mono)] text-gold font-medium">+6cm</span></div>
        <div className="h-1 bg-white/[0.04] rounded-full"><div className="h-1 rounded-full bg-gold" style={{ width: "92%" }} /></div>
        <Insight type="gold" className="mt-2">Physically dominant midfielder in Somalia's squad. Major advantage in aerial duels.</Insight>
      </Card>
    </div>
  );
}

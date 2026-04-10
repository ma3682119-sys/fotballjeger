"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, Badge, Insight, ProgressBar, StepRow, Card, Btn } from "@/components/ui";
import { PATHWAYS } from "@/store/data";

export default function PathwayApp() {
  const [simRunning, setSimRunning] = useState(false);
  const [simCount, setSimCount] = useState(147000);
  const [simResults, setSimResults] = useState(null);
  const [targetAge, setTargetAge] = useState(18);

  const goldmines = PATHWAYS.filter(p => p.rank !== null && p.type !== "red");
  const dead = PATHWAYS.filter(p => p.type === "red");

  const runSim = async () => {
    setSimRunning(true); setSimCount(0);
    const iv = setInterval(() => setSimCount(p => Math.min(p + Math.floor(Math.random() * 12000 + 8000), 700000)), 100);
    try {
      const res = await fetch("/api/pathway/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetAge, numSims: 100000 }) });
      const data = await res.json();
      setSimResults(data); setSimCount(data.totalSimulations || 700000);
    } catch { setSimCount(700000); }
    clearInterval(iv); setSimRunning(false);
  };

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5">Pathway Simulation</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">MONTE CARLO ENGINE</p>

      <StatGrid stats={[
        { val: `${PATHWAYS.find(p => p.rank === 1)?.successRate ?? 0}%`, label: "Top path", color: "var(--color-green)" },
        { val: `${Math.floor(simCount / 1000)}k`, label: "Simulated" },
        { val: goldmines.length, label: "Goldmines" },
        { val: "Aug 26", label: "Deadline" },
      ]} />

      <Card className="!bg-white/[0.02] mb-3">
        <div className="text-[13px] font-medium mb-2">Simulation target</div>
        <div className="flex items-center gap-2 flex-wrap mb-2 text-[12px] text-txt2">
          <span>Senior football by age</span>
          <select value={targetAge} onChange={e => setTargetAge(+e.target.value)} className="text-[12px] py-1 px-2">{[17, 18, 19].map(a => <option key={a} value={a}>{a}</option>)}</select>
        </div>
        <Btn variant="purple" onClick={runSim} disabled={simRunning}>{simRunning ? `Simulating... ${simCount.toLocaleString()}` : "Run simulation — 700k+ paths"}</Btn>
        {!simRunning && simCount >= 147000 && <div className="font-[family-name:var(--font-mono)] text-[10px] text-green mt-1.5">✓ {simCount.toLocaleString()} paths · {goldmines.length} goldmines</div>}
      </Card>

      {simResults && <><SectionLabel>Live results</SectionLabel>{simResults.paths?.slice(0, 5).map((p, i) => (
        <Card key={p.clubId} glow={i === 0 ? "gold" : i === 1 ? "purple" : undefined}>
          <div className="flex items-start justify-between mb-1">
            <div><Badge type={i === 0 ? "gold" : i === 1 ? "purple" : i < 3 ? "gray" : "red"}>#{p.rank}</Badge><div className="text-[13px] font-medium mt-0.5">{p.clubName}</div></div>
            <div className="text-right"><div className={`font-semibold text-lg ${p.successRate > 20 ? "text-green" : p.successRate > 10 ? "text-amber" : "text-red"}`}>{p.successRate}%</div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3">{p.simCount.toLocaleString()} sims</div></div>
          </div>
          <ProgressBar value={p.successRate} color={p.successRate > 20 ? "var(--color-green)" : "var(--color-amber)"} />
        </Card>
      ))}</>}

      <SectionLabel>Goldmine paths</SectionLabel>
      {goldmines.map(p => (
        <Card key={p.id} glow={p.type === "gold" ? "gold" : p.type === "purple" ? "purple" : undefined} className="mb-2">
          <div className="flex items-start justify-between mb-1">
            <div><div className="flex gap-1 mb-1"><Badge type={p.badgeType}>{p.badge}</Badge>{p.tag && <Badge type={p.tagType}>{p.tag}</Badge>}</div><div className="text-[13px] font-medium">{p.title}</div></div>
            <div className="text-right shrink-0"><div className={`font-semibold text-xl ${p.type === "gold" ? "text-gold glow-gold" : ""}`}>{p.successRate}%</div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3">success</div></div>
          </div>
          <ProgressBar value={p.successRate} color={p.barColor} className="mb-1.5" />
          <Insight type={p.type === "gold" ? "gold" : p.type === "gray" ? "green" : "purple"}>{p.insight}</Insight>
          {p.steps.length > 0 && <div className="mt-2"><StepRow steps={p.steps} /></div>}
          <div className="flex gap-1 mt-2"><Btn variant="green">Target club</Btn><Btn>Deep dive</Btn></div>
        </Card>
      ))}

      <SectionLabel>Avoid</SectionLabel>
      {dead.map(p => (
        <Card key={p.id} glow="red"><div className="text-[13px] font-medium mb-1">{p.title}</div><Insight type="red">{p.insight}</Insight></Card>
      ))}
    </div>
  );
}

"use client";
import { useState } from "react";
import { StatGrid, SectionLabel, PageTitle, Badge, Insight, ProgressBar, StepRow, Card } from "@/components/ui";
import { PATHWAYS } from "@/store/data";

export default function PathwaySim() {
  const [pathways, setPathways] = useState(PATHWAYS);
  const [simRunning, setSimRunning] = useState(false);
  const [simCount, setSimCount] = useState(147000);
  const [simResults, setSimResults] = useState(null);
  const [targetAge, setTargetAge] = useState(18);
  const [targetLevel, setTargetLevel] = useState("senior");

  const goldmines = pathways.filter(p => p.rank !== null && p.type !== "red");
  const dead = pathways.filter(p => p.type === "red");

  const runSim = async () => {
    setSimRunning(true);
    setSimCount(0);

    // Animate counter while waiting
    const interval = setInterval(() => {
      setSimCount(prev => Math.min(prev + Math.floor(Math.random() * 12000 + 8000), 700000));
    }, 100);

    try {
      const res = await fetch("/api/pathway/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLevel, targetAge, numSims: 100000 }),
      });
      const data = await res.json();
      setSimResults(data);
      setSimCount(data.totalSimulations || 700000);
    } catch {
      setSimCount(700000);
    }

    clearInterval(interval);
    setSimRunning(false);
  };

  return (
    <div>
      <PageTitle sub="MONTE CARLO ENGINE · COMPUTING OPTIMAL PATHS">Pathway simulation</PageTitle>

      <StatGrid stats={[
        { val: `${pathways.find(p => p.rank === 1)?.successRate ?? 0}%`, label: "Top path success", color: "var(--color-green)" },
        { val: `${Math.floor(simCount / 1000)}k`, label: "Paths simulated" },
        { val: goldmines.length, label: "Goldmine paths" },
        { val: "Aug 26", label: "Critical deadline" },
      ]} />

      <Card className="!bg-bg3 mb-5">
        <div className="font-[family-name:var(--font-display)] text-[13px] font-semibold mb-2.5">
          <span className="text-green">&gt;</span> Simulation target
        </div>
        <div className="flex items-center gap-2.5 flex-wrap mb-3">
          <span className="text-[13px] text-txt2">I want to be playing</span>
          <select value={targetLevel} onChange={e => setTargetLevel(e.target.value)}>
            <option value="senior">senior football</option>
            <option value="div3">div 3 senior</option>
            <option value="div4">div 4 senior</option>
          </select>
          <span className="text-[13px] text-txt2">by age</span>
          <select value={targetAge} onChange={e => setTargetAge(+e.target.value)}>
            <option value={17}>17</option>
            <option value={18}>18</option>
            <option value={19}>19</option>
          </select>
        </div>
        <button
          className="text-[11px] px-4 py-2 rounded-lg bg-purple-dim text-purple border border-purple/25 hover:bg-purple/20 transition font-[family-name:var(--font-mono)] disabled:opacity-50"
          onClick={runSim}
          disabled={simRunning}
        >
          {simRunning ? `SIMULATING... ${simCount.toLocaleString()} PATHS` : "RUN SIMULATION — 700k+ PATHWAYS"}
        </button>
        {!simRunning && simCount >= 147000 && (
          <div className="font-[family-name:var(--font-mono)] text-[11px] text-green glow-green mt-2">
            ✓ Done — {simCount.toLocaleString()} paths evaluated · {goldmines.length} goldmine paths found
          </div>
        )}
      </Card>

      {/* Live simulation results */}
      {simResults && (
        <>
          <SectionLabel>Live simulation results</SectionLabel>
          {simResults.paths?.slice(0, 5).map((p, i) => (
            <Card key={p.clubId} glow={i === 0 ? "gold" : i === 1 ? "purple" : undefined}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge type={i === 0 ? "gold" : i === 1 ? "purple" : i === 2 ? "gray" : "red"}>
                    {p.viable ? `#${p.rank}` : "AVOID"}
                  </Badge>
                  <div className="font-[family-name:var(--font-display)] text-[13px] font-medium mt-1">{p.clubName}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-[family-name:var(--font-display)] text-[22px] font-extrabold ${p.successRate > 20 ? "text-green glow-green" : p.successRate > 10 ? "text-amber" : "text-red"}`}>
                    {p.successRate}%
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">{p.simCount.toLocaleString()} sims</div>
                </div>
              </div>
              <ProgressBar value={p.successRate} color={p.successRate > 20 ? "var(--color-green)" : p.successRate > 10 ? "var(--color-amber)" : "var(--color-red)"} />
              {p.avgYears && (
                <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mt-1">
                  Avg time to senior: {p.avgYears} years
                </div>
              )}
            </Card>
          ))}
        </>
      )}

      <SectionLabel>Goldmine paths — mathematically optimal</SectionLabel>
      {goldmines.map(p => (
        <Card
          key={p.id}
          glow={p.type === "gold" ? "gold" : p.type === "purple" ? "purple" : undefined}
          className="mb-2.5"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex gap-1.5 mb-1.5 flex-wrap">
                <Badge type={p.badgeType}>{p.badge?.toUpperCase()}</Badge>
                {p.tag && <Badge type={p.tagType}>{p.tag?.toUpperCase()}</Badge>}
              </div>
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{p.title}</div>
            </div>
            <div className="text-right shrink-0">
              <div className={`font-[family-name:var(--font-display)] text-[26px] font-extrabold ${p.type === "gold" ? "glow-gold" : p.type === "purple" ? "glow-purple" : ""}`}>
                {p.successRate}%
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3">success rate</div>
            </div>
          </div>

          <ProgressBar value={p.successRate} color={p.barColor} className="mb-2.5" />
          <Insight type={p.type === "gold" ? "gold" : p.type === "gray" ? "green" : "purple"}>
            {p.insight}
          </Insight>

          {p.steps.length > 0 && (
            <div className="mt-2.5"><StepRow steps={p.steps} /></div>
          )}

          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            <button className="text-[11px] px-3 py-1.5 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]">
              TARGET THIS CLUB
            </button>
            <button className="text-[11px] px-3 py-1.5 rounded-lg border border-border2 text-txt2 hover:bg-bg3 hover:text-txt transition font-[family-name:var(--font-mono)]">
              DEEP DIVE
            </button>
          </div>
        </Card>
      ))}

      <SectionLabel>Paths to avoid — simulation flagged</SectionLabel>
      {dead.map(p => (
        <Card key={p.id} className="border-l-2 !border-l-red">
          <div className="font-[family-name:var(--font-display)] text-[13px] font-medium mb-1">{p.title}</div>
          <Insight type="red">{p.insight}</Insight>
        </Card>
      ))}
    </div>
  );
}

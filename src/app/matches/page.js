"use client";
import { useState, useEffect, useMemo } from "react";
import { StatGrid, SectionLabel, PageTitle, Insight, MiniChart, Badge, RatingDisplay, ResultBadge, Card } from "@/components/ui";
import { MATCHES } from "@/store/data";

const POSITIONS = ["LM", "CM", "CAM", "CDM", "RW", "LW", "CB"];
const RESULTS = ["Win", "Draw", "Loss"];

function useMatchStats(matches) {
  return useMemo(() => {
    if (!matches.length) return null;
    const totalMins = matches.reduce((s, m) => s + m.mins, 0);
    const totalGoals = matches.reduce((s, m) => s + m.goals, 0);
    const avgRating = matches.reduce((s, m) => s + m.rating, 0) / matches.length;
    const byPos = {};
    matches.forEach(m => {
      if (!byPos[m.pos]) byPos[m.pos] = { ratings: [], goals: 0, assists: 0, count: 0 };
      byPos[m.pos].ratings.push(m.rating);
      byPos[m.pos].goals += m.goals;
      byPos[m.pos].assists += m.assists;
      byPos[m.pos].count += 1;
    });
    const posBreakdown = Object.entries(byPos).map(([pos, d]) => ({
      pos, avgRating: d.ratings.reduce((a, b) => a + b, 0) / d.ratings.length,
      goals: d.goals, assists: d.assists, count: d.count,
    })).sort((a, b) => b.avgRating - a.avgRating);
    const bestPos = posBreakdown[0]?.pos ?? "LM";
    const ratingHistory = matches.slice().reverse().map(m => m.rating);
    const ratingColors = ratingHistory.map(r => r >= 8 ? "var(--color-green)" : r >= 7 ? "var(--color-amber)" : "var(--color-red)");
    const recent3 = matches.slice(0, 3).map(m => m.rating);
    const older3 = matches.slice(3, 6).map(m => m.rating);
    const recentAvg = recent3.reduce((a, b) => a + b, 0) / recent3.length;
    const olderAvg = older3.length ? older3.reduce((a, b) => a + b, 0) / older3.length : recentAvg;
    const trend = recentAvg > olderAvg + 0.3 ? "up" : recentAvg < olderAvg - 0.3 ? "down" : "stable";
    return { count: matches.length, totalMins, totalGoals, avgRating: +avgRating.toFixed(1), posBreakdown, bestPos, ratingHistory, ratingColors, trend };
  }, [matches]);
}

export default function MatchLogger() {
  const [matches, setMatches] = useState(MATCHES);
  const stats = useMatchStats(matches);
  const [form, setForm] = useState({ opp: "", pos: "LM", result: "Win", mins: 90, goals: 0, assists: 0, rating: 7 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch("/api/matches").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setMatches(d); }).catch(() => {});
  }, []);

  const logMatch = async () => {
    if (!form.opp.trim()) return;
    const match = {
      id: `m${Date.now()}`, opp: `vs ${form.opp}`, date: "Today",
      pos: form.pos, mins: +form.mins, goals: +form.goals, assists: +form.assists,
      result: form.result, score: "—", rating: +form.rating,
    };
    try {
      await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(match),
      });
    } catch {}
    setMatches(prev => [match, ...prev]);
    setForm({ opp: "", pos: "LM", result: "Win", mins: 90, goals: 0, assists: 0, rating: 7 });
  };

  return (
    <div>
      <PageTitle sub={`${matches.length} MATCHES LOGGED · TRACKING ALL METRICS`}>Match logger</PageTitle>

      {stats && (
        <StatGrid stats={[
          { val: stats.count, label: "Matches" },
          { val: stats.totalMins, label: "Minutes" },
          { val: stats.totalGoals, label: "Goals" },
          { val: stats.avgRating, label: "Avg rating" },
        ]} />
      )}

      {stats && (
        <Insight type="purple">
          Your highest-output position is {stats.bestPos} (avg {stats.posBreakdown[0]?.avgRating.toFixed(1)}). Form trend is {stats.trend === "up" ? "↑ rising" : stats.trend === "down" ? "↓ falling" : "→ stable"}. Lead with {stats.bestPos} in emails to coaches.
        </Insight>
      )}

      {stats && (
        <>
          <SectionLabel>Rating trend — last {stats.ratingHistory.length} matches</SectionLabel>
          <div className="mb-4">
            <MiniChart data={stats.ratingHistory} colors={stats.ratingColors} height={44} />
          </div>
        </>
      )}

      {stats && stats.posBreakdown.length > 1 && (
        <>
          <SectionLabel>By position</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {stats.posBreakdown.map(p => (
              <div key={p.pos} className="bg-bg3 border border-border rounded-lg p-3 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green/20" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green/20" />
                <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1">{p.pos}</div>
                <div className="font-[family-name:var(--font-display)] text-lg font-bold">{p.avgRating.toFixed(1)}</div>
                <div className="text-[11px] text-txt3">{p.count} games · {p.goals}G {p.assists}A</div>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionLabel>Log new match</SectionLabel>
      <Card>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Opponent</div>
            <input type="text" placeholder="Club name" value={form.opp} onChange={e => set("opp", e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Position</div>
            <select value={form.pos} onChange={e => set("pos", e.target.value)} className="w-full">
              {POSITIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Result</div>
            <select value={form.result} onChange={e => set("result", e.target.value)} className="w-full">
              {RESULTS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Minutes</div>
            <input type="number" value={form.mins} onChange={e => set("mins", e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Goals</div>
            <input type="number" value={form.goals} onChange={e => set("goals", e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-1 uppercase tracking-wider">&gt; Assists</div>
            <input type="number" value={form.assists} onChange={e => set("assists", e.target.value)} className="w-full" />
          </div>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-txt3 min-w-[50px]">&gt; Rating</span>
          <input type="range" min={1} max={10} step={1} value={form.rating} onChange={e => set("rating", +e.target.value)} className="flex-1" />
          <span className="font-[family-name:var(--font-display)] text-xl font-bold min-w-[28px] text-right">{form.rating}</span>
        </div>
        <button
          className="text-[11px] px-4 py-2 rounded-lg bg-green-dim text-green border border-green/25 hover:bg-green/20 transition font-[family-name:var(--font-mono)]"
          onClick={logMatch}
        >
          LOG MATCH
        </button>
      </Card>

      <SectionLabel>Recent matches</SectionLabel>
      {matches.map(m => (
        <Card key={m.id}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-[family-name:var(--font-display)] text-[13px] font-medium">{m.opp}</div>
              <div className="text-xs text-txt2 font-[family-name:var(--font-mono)]">{m.date} · {m.pos} · {m.mins}min · {m.goals}G {m.assists}A</div>
            </div>
            <div className="text-right shrink-0 flex items-center gap-2">
              <ResultBadge result={m.result} />
              <RatingDisplay value={m.rating} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

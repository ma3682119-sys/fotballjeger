"use client";
import { useState, useEffect, useMemo } from "react";
import { StatGrid, SectionLabel, Insight, MiniChart, RatingDisplay, ResultBadge, Card, Btn } from "@/components/ui";
import { MATCHES } from "@/store/data";

const POS = ["LM", "CM", "CAM", "CDM", "RW", "LW", "CB"];
const RES = ["Win", "Draw", "Loss"];

export default function MatchesApp() {
  const [matches, setMatches] = useState(MATCHES);
  const [form, setForm] = useState({ opp: "", pos: "LM", result: "Win", mins: 90, goals: 0, assists: 0, rating: 7 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetch("/api/matches").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setMatches(d); }).catch(() => {}); }, []);

  const stats = useMemo(() => {
    if (!matches.length) return null;
    const totalMins = matches.reduce((s, m) => s + m.mins, 0);
    const totalGoals = matches.reduce((s, m) => s + m.goals, 0);
    const avg = +(matches.reduce((s, m) => s + m.rating, 0) / matches.length).toFixed(1);
    const byPos = {};
    matches.forEach(m => { if (!byPos[m.pos]) byPos[m.pos] = { r: [], g: 0, a: 0, c: 0 }; byPos[m.pos].r.push(m.rating); byPos[m.pos].g += m.goals; byPos[m.pos].a += m.assists; byPos[m.pos].c++; });
    const pb = Object.entries(byPos).map(([p, d]) => ({ pos: p, avg: +(d.r.reduce((a, b) => a + b, 0) / d.r.length).toFixed(1), g: d.g, a: d.a, c: d.c })).sort((a, b) => b.avg - a.avg);
    const rh = matches.slice().reverse().map(m => m.rating);
    const rc = rh.map(r => r >= 8 ? "var(--color-green)" : r >= 7 ? "var(--color-amber)" : "var(--color-red)");
    const r3 = matches.slice(0, 3).map(m => m.rating), o3 = matches.slice(3, 6).map(m => m.rating);
    const trend = r3.reduce((a, b) => a + b, 0) / 3 > (o3.length ? o3.reduce((a, b) => a + b, 0) / 3 : 7) + 0.3 ? "up" : "stable";
    return { count: matches.length, totalMins, totalGoals, avg, pb, bestPos: pb[0]?.pos || "LM", rh, rc, trend };
  }, [matches]);

  const log = async () => {
    if (!form.opp.trim()) return;
    const m = { id: `m${Date.now()}`, opp: `vs ${form.opp}`, date: "Today", pos: form.pos, mins: +form.mins, goals: +form.goals, assists: +form.assists, result: form.result, score: "—", rating: +form.rating };
    try { await fetch("/api/matches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(m) }); } catch {}
    setMatches(p => [m, ...p]);
    setForm({ opp: "", pos: "LM", result: "Win", mins: 90, goals: 0, assists: 0, rating: 7 });
  };

  return (
    <div>
      <h2 className="text-base font-semibold mb-0.5">Match Logger</h2>
      <p className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 mb-4 tracking-wide">{matches.length} MATCHES LOGGED</p>

      {stats && <StatGrid stats={[{ val: stats.count, label: "Matches" }, { val: stats.totalMins, label: "Minutes" }, { val: stats.totalGoals, label: "Goals" }, { val: stats.avg, label: "Avg rating" }]} />}
      {stats && <Insight type="purple">Best position: {stats.bestPos} (avg {stats.pb[0]?.avg}). Form: {stats.trend === "up" ? "↑ rising" : "→ stable"}. Lead with {stats.bestPos} in emails.</Insight>}
      {stats && <><SectionLabel>Rating trend</SectionLabel><div className="mb-3"><MiniChart data={stats.rh} colors={stats.rc} height={36} /></div></>}

      {stats?.pb.length > 1 && <><SectionLabel>By position</SectionLabel><div className="grid grid-cols-3 gap-1.5 mb-3">{stats.pb.map(p => (
        <div key={p.pos} className="bg-white/[0.02] border border-border rounded-md p-2 text-center">
          <div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3">{p.pos}</div>
          <div className="font-semibold text-base">{p.avg}</div>
          <div className="text-[10px] text-txt3">{p.c}g · {p.g}G {p.a}A</div>
        </div>
      ))}</div></>}

      <SectionLabel>Log new match</SectionLabel>
      <Card>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">OPPONENT</div><input type="text" placeholder="Club name" value={form.opp} onChange={e => set("opp", e.target.value)} className="w-full" /></div>
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">POSITION</div><select value={form.pos} onChange={e => set("pos", e.target.value)} className="w-full">{POS.map(p => <option key={p}>{p}</option>)}</select></div>
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">RESULT</div><select value={form.result} onChange={e => set("result", e.target.value)} className="w-full">{RES.map(r => <option key={r}>{r}</option>)}</select></div>
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">MINUTES</div><input type="number" value={form.mins} onChange={e => set("mins", e.target.value)} className="w-full" /></div>
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">GOALS</div><input type="number" value={form.goals} onChange={e => set("goals", e.target.value)} className="w-full" /></div>
          <div><div className="font-[family-name:var(--font-mono)] text-[9px] text-txt3 mb-0.5">ASSISTS</div><input type="number" value={form.assists} onChange={e => set("assists", e.target.value)} className="w-full" /></div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-[family-name:var(--font-mono)] text-[10px] text-txt3 w-10">Rating</span>
          <input type="range" min={1} max={10} step={1} value={form.rating} onChange={e => set("rating", +e.target.value)} className="flex-1" style={{ accentColor: "var(--color-green)" }} />
          <span className="font-semibold text-lg w-7 text-right">{form.rating}</span>
        </div>
        <Btn variant="green" onClick={log}>Log match</Btn>
      </Card>

      <SectionLabel>Recent</SectionLabel>
      {matches.map(m => (
        <Card key={m.id}>
          <div className="flex items-center justify-between">
            <div><div className="text-[12px] font-medium">{m.opp}</div><div className="text-[10px] text-txt3 font-[family-name:var(--font-mono)]">{m.date} · {m.pos} · {m.mins}min · {m.goals}G {m.assists}A</div></div>
            <div className="flex items-center gap-2 shrink-0"><ResultBadge result={m.result} /><RatingDisplay value={m.rating} /></div>
          </div>
        </Card>
      ))}
    </div>
  );
}

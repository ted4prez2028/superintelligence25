import { useState } from "react";
import { api } from "../api";
import { Section, Code } from "./UI";

export default function AgentsPlanner({ onPlanned }) {
  const [objective, setObjective] = useState("site:python.org asyncio");
  const [budget, setBudget] = useState(4);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const doPlan = async () => {
    setLoading(true); setErr("");
    try {
      const p = await api.plan(objective, Number(budget));
      setPlan(p.plan);
      onPlanned?.(p.plan);
    } catch (e) { setErr(String(e.message || e)); }
    finally { setLoading(false); }
  };

  return (
    <Section title="Plan an Objective" right={
      <button className="btn" onClick={doPlan} disabled={loading}>
        {loading ? "Planning..." : "Create Plan"}
      </button>
    }>
      <div className="grid md:grid-cols-3 gap-3">
        <input className="input md:col-span-2" value={objective} onChange={e=>setObjective(e.target.value)} placeholder="Objective"/>
        <input className="input" type="number" min="1" max="50" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="Budget"/>
      </div>
      {err && <p className="mt-3 text-red-400">{err}</p>}
      {plan && <div className="mt-4"><Code>{JSON.stringify(plan, null, 2)}</Code></div>}
    </Section>
  );
}
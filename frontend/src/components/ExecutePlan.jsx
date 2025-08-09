import { useState } from "react";
import { api } from "../api";
import { Section, Code } from "./UI";

export default function ExecutePlan({ plan: initialPlan }) {
  const [planText, setPlanText] = useState(JSON.stringify(initialPlan || [], null, 2));
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setErr("");
    try {
      const parsed = JSON.parse(planText || "[]");
      const res = await api.execute(parsed);
      setResult(res.result);
    } catch (e) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  const sampleShell = () => {
    const s = [
      { "tool": "system.shell", "args": { "cmd": ["git","--version"] } }
    ];
    setPlanText(JSON.stringify(s, null, 2));
  };

  return (
    <Section title="Execute Plan" right={
      <div className="flex gap-2">
        <button className="btn-alt" onClick={sampleShell}>Sample: system.shell</button>
        <button className="btn" onClick={run} disabled={busy}>{busy ? "Running..." : "Run"}</button>
      </div>
    }>
      <textarea className="input h-48 font-mono" value={planText} onChange={e=>setPlanText(e.target.value)} />
      {err && <p className="mt-3 text-red-400">{err}</p>}
      {result && <div className="mt-4"><Code>{JSON.stringify(result, null, 2)}</Code></div>}
      <p className="text-xs text-slate-400 mt-2">Note: <code>system.shell</code> uses allow‑listed binaries only.</p>
    </Section>
  );
}
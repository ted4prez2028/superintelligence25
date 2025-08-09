import { Section, Code } from "./UI";
import { useState } from "react";
import { api } from "../api";

export default function Toolbox() {
  const [url, setUrl] = useState("https://www.python.org");
  const [objective, setObjective] = useState("site:docs.python.org uvicorn");
  const [output, setOutput] = useState(null);
  const [err, setErr] = useState("");

  const runSearchFetch = async () => {
    setErr(""); setOutput(null);
    try {
      const plan = [
        { tool: "web.search", args: { query: objective, max_results: 3 } },
        { tool: "web.fetch",  args: { url: "${result.0.url}" } }
      ];
      const res = await api.execute(plan);
      setOutput(res.result);
    } catch (e) { setErr(String(e.message || e)); }
  };

  const runFetchDirect = async () => {
    setErr(""); setOutput(null);
    try {
      const plan = [{ tool: "web.fetch", args: { url } }];
      const res = await api.execute(plan);
      setOutput(res.result);
    } catch (e) { setErr(String(e.message || e)); }
  };

  return (
    <Section title="One‑click Tools">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Search → Fetch</h3>
          <input className="input mb-3" value={objective} onChange={e=>setObjective(e.target.value)} />
          <button className="btn" onClick={runSearchFetch}>Run</button>
        </div>
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Fetch URL</h3>
          <input className="input mb-3" value={url} onChange={e=>setUrl(e.target.value)} />
          <button className="btn" onClick={runFetchDirect}>Fetch</button>
        </div>
      </div>
      {err && <p className="text-red-400 mt-3">{err}</p>}
      {output && <div className="mt-4"><Code>{JSON.stringify(output, null, 2)}</Code></div>}
    </Section>
  );
}
import { useState } from "react";
import { api } from "../api";
import { Section, Code } from "./UI";

export default function RAGPanel() {
  const [q, setQ] = useState("What does this project do?");
  const [k, setK] = useState(5);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  const query = async () => {
    setErr(""); setRes(null);
    try { setRes(await api.ragQuery(q, Number(k))); }
    catch (e) { setErr(String(e.message || e)); }
  };

  return (
    <Section title="RAG Query">
      <div className="grid md:grid-cols-6 gap-3">
        <input className="input md:col-span-5" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="input" type="number" min="1" max="20" value={k} onChange={e=>setK(e.target.value)} />
      </div>
      <div className="mt-3">
        <button className="btn" onClick={query}>Search Knowledge</button>
      </div>
      {err && <p className="mt-3 text-red-400">{err}</p>}
      {res && <div className="mt-4 space-y-3">
        {res.matches?.map((m,i)=>(
          <div key={i} className="card p-3">
            <div className="text-xs text-slate-400">{m.source}</div>
            <div className="mt-2 whitespace-pre-wrap">{m.chunk}</div>
          </div>
        ))}
      </div>}
    </Section>
  );
}
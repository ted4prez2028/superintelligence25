import { useState } from "react";
import { api } from "../api";
import { Section, Code } from "./UI";

export default function MetricsPane() {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr(""); setText("");
    try { setText(await api.metrics()); }
    catch (e) { setErr(String(e.message || e)); }
  };

  return (
    <Section title="Prometheus Metrics" right={<button className="btn" onClick={load}>Refresh</button>}>
      {err && <p className="text-red-400 mb-2">{err}</p>}
      <Code>{text || "# (Click Refresh to pull /metrics)"}</Code>
    </Section>
  );
}
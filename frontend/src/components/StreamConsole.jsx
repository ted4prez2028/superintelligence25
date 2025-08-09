import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { Section, Code } from "./UI";

export default function StreamConsole() {
  const [lines, setLines] = useState([]);
  const [listening, setListening] = useState(false);
  const evtRef = useRef(null);

  const start = () => {
    if (evtRef.current) return;
    const es = new EventSource(api.sseUrl());
    evtRef.current = es; setListening(true);
    es.onmessage = (e) => setLines((prev) => [...prev, e.data]);
    es.onerror = () => { stop(); };
  };
  const stop = () => { evtRef.current?.close(); evtRef.current = null; setListening(false); };
  useEffect(() => () => stop(), []);

  return (
    <Section title="Live Stream (SSE)" right={
      listening ? <button className="btn-alt" onClick={stop}>Stop</button>
                : <button className="btn" onClick={start}>Start</button>
    }>
      <Code>{lines.join("\n") || "No messages yet..."}</Code>
    </Section>
  );
}
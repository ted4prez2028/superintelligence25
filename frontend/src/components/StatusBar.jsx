import { useEffect, useState } from "react";
import { api } from "../api";

export default function StatusBar() {
  const [health, setHealth] = useState(null);
  const [ready, setReady] = useState(null);
  const [err, setErr] = useState("");

  const refresh = async () => {
    setErr("");
    try {
      const [h, r] = await Promise.all([api.health(), api.ready()]);
      setHealth(h.ok); setReady(r.ok);
    } catch (e) { setErr(String(e.message || e)); }
  };
  useEffect(() => { refresh(); }, []);

  return (
    <div className="card p-4 flex items-center justify-between">
      <div className="flex gap-3">
        <span className={`badge ${health ? "text-green-400" : "text-red-400"}`}>
          health: {String(!!health)}
        </span>
        <span className={`badge ${ready ? "text-green-400" : "text-yellow-400"}`}>
          ready: {String(!!ready)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {err && <span className="text-red-400 text-sm">{err}</span>}
        <button className="btn-alt" onClick={refresh}>Refresh</button>
      </div>
    </div>
  );
}
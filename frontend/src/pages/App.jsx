import React, { useState, useEffect } from "react";
import { API } from "../api";

export default function App() {
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState([]);

  async function send() {
    if (!msg.trim()) return;
    const r = await API.chat(msg, "default");
    setLog((l) => [...l, { me: msg }, { bot: r.message }]);
    setMsg("");
  }

  return (
    <div style={{ fontFamily: "ui-sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>ASI Chat</h1>
      <div style={{ marginTop: 12 }}>
        <input value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="Say something to the ASI..." style={{ width: "70%" }} />
        <button onClick={send} style={{ marginLeft: 8 }}>Send</button>
      </div>
      <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
        {log.map((m, i)=>(
          <div key={i} style={{ background:"#111", color:"#eee", padding:12, borderRadius:12 }}>
            {m.me ? <b>You:</b> : <b>ASI:</b>} {m.me || m.bot}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, opacity: 0.8 }}>
        <a href="/admin">Go to Admin</a>
      </div>
    </div>
  );
}

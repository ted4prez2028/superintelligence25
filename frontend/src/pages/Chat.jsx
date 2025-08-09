import React, { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Chat(){
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState([]);
  const [mode, setMode] = useState('sse'); // 'sse' | 'ws'

  async function send(){
    if(!msg.trim()) return;
    if(mode==='sse'){ await sendSSE(); } else { await sendWS(); }
  }

  async function sendSSE(){
    const userMsg = msg; setMsg('');
    setLog((l)=>[...l,{me:userMsg},{bot:''}]); let idx=-1;
    // kick backend compute with POST (actual SSE stream endpoint emits deltas)
    fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:userMsg})});
    const es = new EventSource('/api/chat/stream');
    es.onmessage = (e)=>{ try{ const d=JSON.parse(e.data); if(d.delta!==undefined){ setLog((l)=>{ const c=l.slice(); if(idx===-1) idx=c.length-1; c[idx]={bot:(c[idx].bot||'')+d.delta}; return c; }); } }catch(_){} };
    es.addEventListener('end',()=>es.close());
  }

  async function sendWS(){
    const userMsg = msg; setMsg('');
    setLog((l)=>[...l,{me:userMsg},{bot:''}]); let idx=-1;
    const ws = new WebSocket((location.protocol==='https:'?'wss://':'ws://') + location.hostname + ':8080/ws/chat');
    ws.onopen = ()=> ws.send(JSON.stringify({message:userMsg}));
    ws.onmessage = (e)=>{ const d=JSON.parse(e.data); if(d.delta){ setLog((l)=>{ const c=l.slice(); if(idx===-1) idx=c.length-1; c[idx]={bot:(c[idx].bot||'')+d.delta}; return c; }); } if(d.event==='end'){ ws.close(); } };
  }

  return (
    <Shell title="Chat">
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
        <Card title="Conversation" right={<span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs">{mode.toUpperCase()}</span>}>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {log.map((m,i)=>(
              <div key={i} className={`p-4 rounded-2xl border ${m.me?'border-primary/30 bg-primary/10':'border-white/10 bg-white/10'}`}>
                <div className="text-xs uppercase tracking-wide mb-1 text-white/50">{m.me?'You':'ASI'}</div>
                <div className="leading-relaxed whitespace-pre-wrap">{m.me||m.bot}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Input placeholder="Ask anything…" value={msg} onChange={(e)=>setMsg(e.target.value)} />
            <Button variant="primary" onClick={send}>Send</Button>
          </div>
        </Card>
        <Card title="Mode"><div className="flex gap-2"><Button onClick={()=>setMode('sse')} variant={mode==='sse'?'primary':'default'}>SSE</Button><Button onClick={()=>setMode('ws')} variant={mode==='ws'?'primary':'default'}>WebSocket</Button></div></Card>
      </div>
    </Shell>
  );
}

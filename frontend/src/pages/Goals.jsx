import React, { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import { API } from '../api';

export default function Goals(){
  const [payload, setPayload] = useState('{"type":"planning","payload":{"context":"achieve X"}}');
  const [taskId, setTaskId] = useState('');
  const [out, setOut] = useState('');

  async function submit(){ const obj = JSON.parse(payload); const r = await API.submitTask(obj.type, obj.payload); setTaskId(r.id); setOut(JSON.stringify(r, null, 2)); }
  async function poll(){ if(!taskId) return; const r = await API.taskStatus(taskId); setOut(JSON.stringify(r, null, 2)); }

  return (<Shell title="Goal Queue">
    <div className="grid xl:grid-cols-2 gap-6">
      <Card title="Submit Task (JSON)">
        <Textarea rows={8} value={payload} onChange={(e)=>setPayload(e.target.value)} className="font-mono text-sm" />
        <div className="mt-3 flex gap-3"><Button variant="primary" onClick={submit}>Submit</Button><Button onClick={poll}>Poll</Button></div>
      </Card>
      <Card title="Output"><pre className="min-h-[260px] w-full bg-black/50 border border-white/10 rounded-xl p-4 overflow-auto">{out}</pre></Card>
    </div>
  </Shell>);
}

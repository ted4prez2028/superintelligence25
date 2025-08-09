import React, { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { API } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UMAP } from 'umap-js';

export default function Dashboard(){
  const [q, setQ] = useState('search text');
  const [data, setData] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [points, setPoints] = useState([]);
  const [task, setTask] = useState(null);

  async function runSearch(){
    const r = await API.vectorsQuery(q, 10);
    const rows = (r.results || []).map((x, i)=>({ name: x.id || `doc-${i+1}`, score: Math.round(x.score*1000)/1000 }));
    setData(rows);
  }
  async function queueDemoTask(){ const r = await API.submitTask('planning', { context: 'Dashboard demo run' }); setTaskId(r.id); }
  async function poll(){ if(!taskId) return; const r = await API.taskStatus(taskId); setTask(r); }


  async function loadVectors(){
    const r = await fetch('/api/vectors/all?limit=200'); 
    const data = await r.json();
    const items = data.items || [];
    if(items.length === 0){ setPoints([]); return; }
    const X = items.map(x => x.embedding);
    const umap = new UMAP({ nComponents: 2, nNeighbors: 15, minDist: 0.1 });
    const embedding = umap.fit(X);
    const pts = embedding.map((xy, i) => ({ x: xy[0], y: xy[1], id: items[i].id }));
    setPoints(pts);
  }
  return (
<Shell title="Dashboard">
    <div className="grid xl:grid-cols-2 gap-6">
      <Card title="Vector Search (Top-k Scores)">
        <div className="flex gap-2 mb-3"><Input placeholder="Query" value={q} onChange={(e)=>setQ(e.target.value)} /><Button variant="primary" onClick={runSearch}>Search</Button></div>
        <div className="h-72 bg-white/5 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" hide/><YAxis domain={[0,1]}/><Tooltip/><Bar dataKey="score"/></BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
        <Card title="Memory Map (UMAP)">
          <div className="flex gap-2 mb-3">
            <Button variant="primary" onClick={loadVectors}>Compute UMAP</Button>
          </div>
          <div className="h-72 bg-white/5 rounded-xl p-4 overflow-hidden">
            <svg viewBox="-10 -10 20 20" className="w-full h-full">
              {points.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="0.12" fill="currentColor" className="text-accent" />))}
            </svg>
          </div>
        </Card>

      <Card title="Task Monitor">
        <div className="flex gap-2 mb-3">
          <Button variant="primary" onClick={queueDemoTask}>Submit Demo Task</Button>
          <Button onClick={poll}>Poll</Button>
          <span className="text-white/60 text-sm">{taskId ? `Task: ${taskId}` : 'No task yet'}</span>
        </div>
        <pre className="min-h-[260px] w-full bg-black/50 border border-white/10 rounded-xl p-4 overflow-auto">{task ? JSON.stringify(task, null, 2) : 'No data'}</pre>
      </Card>
    </div>
  </Shell>);
}

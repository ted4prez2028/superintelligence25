import React, { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { API } from '../api';

export default function Memory(){
  const [id, setId] = useState('doc-1');
  const [text, setText] = useState('Example memory text to vectorize');
  const [query, setQuery] = useState('search text');
  const [out, setOut] = useState('');

  async function upsert(){ setOut(JSON.stringify(await API.vectorsUpsert(id, text), null, 2)); }
  async function doQuery(){ setOut(JSON.stringify(await API.vectorsQuery(query, 5), null, 2)); }

  return (<Shell title="Memory Vectors">
    <div className="grid xl:grid-cols-2 gap-6">
      <Card title="Upsert">
        <Input placeholder="ID" value={id} onChange={(e)=>setId(e.target.value)} />
        <Textarea rows={6} value={text} onChange={(e)=>setText(e.target.value)} />
        <div className="flex gap-3"><Button variant="primary" onClick={upsert}>Upsert</Button><Button onClick={()=>{setId(''); setText('');}}>Clear</Button></div>
      </Card>
      <Card title="Search">
        <Input placeholder="Query" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Button variant="primary" onClick={doQuery}>Search</Button>
        <pre className="min-h-[220px] w-full bg-black/50 border border-white/10 rounded-xl p-4 overflow-auto">{out}</pre>
      </Card>
    </div>
  </Shell>);
}

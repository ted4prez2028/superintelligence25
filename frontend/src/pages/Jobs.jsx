
import React, { useEffect, useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Jobs(){
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const size = 20;

  async function load(){
    const r = await fetch(`/api/tasks/list?offset=${page*size}&limit=${size}`);
    const data = await r.json();
    setRows(data.items || []); setTotal(data.total || 0);
  }
  useEffect(()=>{ load(); }, [page]);

  return (
    <Shell title="Background Jobs">
      <Card title={`Jobs (${total})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-white/60"><tr><th className="py-2 pr-4">ID</th><th className="py-2 pr-4">Status</th><th className="py-2 pr-4">Payload</th><th className="py-2 pr-4">Result/Error</th></tr></thead>
            <tbody>
              {rows.map((r)=>(
                <tr key={r.id} className="border-t border-white/10">
                  <td className="py-2 pr-4 font-mono text-xs">{r.id}</td>
                  <td className="py-2 pr-4">{r.status}</td>
                  <td className="py-2 pr-4 text-white/80"><pre className="max-w-[460px] overflow-auto">{JSON.stringify(r.payload)}</pre></td>
                  <td className="py-2 pr-4 text-white/80"><pre className="max-w-[460px] overflow-auto">{r.result ? JSON.stringify(r.result) : (r.error || '')}</pre></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2 items-center">
          <Button onClick={()=>setPage(Math.max(0,page-1))}>Prev</Button>
          <div className="text-white/60 text-sm">Page {page+1} / {Math.max(1, Math.ceil(total/size))}</div>
          <Button onClick={()=>setPage(page+1)}>Next</Button>
          <Button variant="primary" onClick={load}>Refresh</Button>
        </div>
      </Card>
    </Shell>
  );
}

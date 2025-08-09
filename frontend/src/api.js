export const API = {
  async chat(message, system = "You are helpful."){
    const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message, system }) });
    if(!r.ok) throw new Error(await r.text());
    return await r.json();
  },
  async runPlanning(payload){ return post('/api/runners/planning', payload); },
  async runEvaluation(payload){ return post('/api/runners/evaluation', payload); },
  async runSelfModel(payload){ return post('/api/runners/self-model', payload); },
  async runPolicyLoops(payload){ return post('/api/runners/policy-loops', payload); },
  async submitTask(type, payload){ return post('/api/tasks/submit', { type, payload }); },
  async taskStatus(id){ const r = await fetch(`/api/tasks/${id}`); return r.json(); },
  async vectorsUpsert(id, text){ return post('/api/vectors/upsert', { id, text }); },
  async vectorsQuery(text, top_k=5){ return post('/api/vectors/query', { text, top_k }); },
};
async function post(url, body){ const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }); if(!r.ok) throw new Error(await r.text()); return r.json(); }

export const api = {
  async plan(objective, budget = 5) {
    return post('/api/runners/planning', { context: objective, budget });
  },
  async execute(plan) {
    return post('/api/tools/execute', { plan });
  },
  async ragQuery(text, top_k = 5) {
    return post('/api/vectors/query', { text, top_k });
  },
  async metrics() {
    const r = await fetch('/api/metrics');
    if (!r.ok) throw new Error(await r.text());
    return await r.text();
  },
  async health() {
    const r = await fetch('/api/health');
    if (!r.ok) throw new Error(await r.text());
    return await r.json();
  },
  async ready() {
    const r = await fetch('/api/ready');
    if (!r.ok) throw new Error(await r.text());
    return await r.json();
  },
  async asiScore() {
    const r = await fetch('/api/asi/score');
    if (!r.ok) throw new Error(await r.text());
    return await r.json();
  },
  async asiAuto() {
    const r = await fetch('/api/asi/auto', { method: 'POST' });
    if (!r.ok) throw new Error(await r.text());
    return await r.json();
  },
  sseUrl() {
    return '/api/chat/stream';
  }
};

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default api;

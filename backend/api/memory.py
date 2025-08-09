import os, sqlite3, math, json
from typing import Dict, List
from openai import OpenAI
import numpy as np

DB = os.path.join(os.path.dirname(__file__), "..", "memory.db")

def _conn():
    c = sqlite3.connect(DB)
    c.execute("CREATE TABLE IF NOT EXISTS vectors (id TEXT PRIMARY KEY, text TEXT, embedding BLOB)")
    return c

def _embed(text: str) -> List[float]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    r = client.embeddings.create(model="text-embedding-3-small", input=text)
    return r.data[0].embedding

def upsert(id: str, text: str) -> Dict:
    e = json.dumps(_embed(text)).encode('utf-8')
    with _conn() as c:
        c.execute("REPLACE INTO vectors (id,text,embedding) VALUES (?,?,?)", (id,text,e))
    return {"id": id}

def query(text: str, top_k: int = 5) -> Dict:
    q = _embed(text)
    with _conn() as c:
        rows = c.execute("SELECT id,text,embedding FROM vectors").fetchall()
    res = []
    for rid, rtext, remb in rows:
        v = json.loads(remb.decode('utf-8'))
        sim = float(np.dot(q,v) / (np.linalg.norm(q)*np.linalg.norm(v) + 1e-9))
        res.append({"id": rid, "text": rtext, "score": sim})
    res.sort(key=lambda x: x["score"], reverse=True)
    return {"results": res[:top_k]}


def all_vectors(limit: int = 200):
    with _conn() as c:
        rows = c.execute("SELECT id, text, embedding FROM vectors LIMIT ?", (limit,)).fetchall()
    out = []
    for rid, rtext, remb in rows:
        v = json.loads(remb.decode('utf-8'))
        out.append({"id": rid, "text": rtext, "embedding": v})
    return {"items": out}

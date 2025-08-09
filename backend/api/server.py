import os, json, logging, asyncio
from typing import Dict, Any
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, PlainTextResponse
from dotenv import load_dotenv

from .auth import verify_request
from .rate_limit import allow
from . import runners, tasks, memory, asi

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(message)s')
app = FastAPI(title="ASI Backend", version="2.1.0", description="OpenAPI for admin + runners + vectors")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def boot():
    await tasks.start_workers(1)

@app.get("/health")
async def health(): return {"ok": True}

@app.get("/ready")
async def ready(): return {"ok": True}

@app.get("/metrics")
async def metrics():
    return PlainTextResponse("dummy_metric 1\n")

@app.get("/asi/score")
async def asi_score():
    """Increment and return ASI criteria scores.

    Each request raises every category by *at least two* points and gradually
    increases its own step size to mimic self‑improvement. Scores are capped at
    10 to maintain a minimal safety boundary. The numbers are illustrative and
    do not reflect real superintelligence.
    """
    return asi.increment_scores()


@app.post("/asi/auto")
async def asi_auto():
    """Autonomously progress scores to their maximum values."""

    await asi.autonomous_progress()
    return asi.perfect_scores()

@app.post("/chat")
async def chat(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 5)
    msg = data.get("message") or "Hello"
    sys = data.get("system","You are helpful.")
    out = await runners._chat(msg, sys)
    return {"message": out}

@app.post("/chat/stream")
async def chat_stream(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 5)
    msg = data.get("message") or "Hello"
    sys = data.get("system","You are helpful.")

    async def gen():
        text = await runners._chat(msg, sys)
        for i in range(0, len(text), 50):
            yield f"data: {json.dumps({'delta': text[i:i+50]})}\n\n"
        yield "event: end\ndata: {}\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.websocket("/ws/chat")
async def ws_chat(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_json()
            msg = data.get("message","Hello")
            text = await runners._chat(msg, "You are helpful.")
            for i in range(0, len(text), 50):
                await ws.send_json({"delta": text[i:i+50]})
            await ws.send_json({"event":"end"})
    except WebSocketDisconnect:
        return

@app.post("/runners/planning")
async def planning(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return await runners.run_planning(data)

@app.post("/runners/evaluation")
async def evaluation(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return await runners.run_evaluation(data)

@app.post("/runners/self-model")
async def self_model(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return await runners.run_self_model(data)

@app.post("/runners/policy-loops")
async def policy_loops(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return await runners.run_policy_loops(data)

@app.post("/tasks/submit")
async def submit_task(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 5)
    kind = data.get("type"); payload = data.get("payload", {})
    m = {"planning": runners.run_planning, "evaluation": runners.run_evaluation, "self-model": runners.run_self_model, "policy-loops": runners.run_policy_loops}
    fn = m.get(kind); 
    if not fn: return {"error":"unknown type"}
    tid = tasks.submit(fn, payload); return {"id": tid, "status":"queued"}

@app.get("/tasks/list")
async def task_list(offset: int = 0, limit: int = 50):
    return tasks.list_tasks(offset, limit)

@app.get("/tasks/{tid}")
async def task_status(tid: str, request: Request, _auth=Depends(verify_request)):
    allow(request, 1); return tasks.status(tid)

@app.post("/vectors/upsert")
async def vectors_upsert(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return memory.upsert(data["id"], data["text"])

@app.post("/vectors/query")
async def vectors_query(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10); return memory.query(data["text"], int(data.get("top_k",5)))


@app.get("/vectors/all")
async def vectors_all(request: Request, limit: int = 200, _auth=Depends(verify_request)):
    allow(request, 5)
    return memory.all_vectors(limit)


@app.post("/tools/execute")
async def tools_execute(data: Dict[str, Any], request: Request, _auth=Depends(verify_request)):
    allow(request, 10)
    plan = data.get("plan", [])
    results = []
    for step in plan:
        tool = step.get("tool")
        args = step.get("args", {})
        if tool == "system.shell":
            cmd = args.get("cmd")
            if not isinstance(cmd, list):
                results.append({"error": "cmd must be list"})
                continue
            allowed = {"ls", "git", "python"}
            if cmd[0] not in allowed:
                results.append({"error": "command not allowed"})
                continue
            proc = await asyncio.create_subprocess_exec(*cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
            out, err = await proc.communicate()
            results.append({"stdout": out.decode(), "stderr": err.decode(), "returncode": proc.returncode})
        elif tool == "web.fetch":
            url = args.get("url")
            if not url:
                results.append({"error": "missing url"})
                continue
            import httpx
            async with httpx.AsyncClient() as client:
                r = await client.get(url)
                results.append({"status": r.status_code, "text": r.text[:1000]})
        elif tool == "web.search":
            query = args.get("query")
            k = int(args.get("max_results", 3))
            import re, httpx
            async with httpx.AsyncClient() as client:
                r = await client.get("https://duckduckgo.com/html/", params={"q": query})
            links = re.findall(r'<a class="result__a" href="(.*?)"', r.text)
            results.append({"results": [{"url": u} for u in links[:k]]})
        else:
            results.append({"error": f"unknown tool {tool}"})
    return {"result": results}


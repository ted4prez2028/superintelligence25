import asyncio, uuid
_tasks = {}
_q = asyncio.Queue()

async def worker():
    while True:
        tid = await _q.get()
        task = _tasks.get(tid); 
        if not task: continue
        fn, payload = task["fn"], task["payload"]
        try:
            res = await fn(payload)
            task.update(status="done", result=res)
        except Exception as e:
            task.update(status="error", error=str(e))

async def start_workers(n=1):
    for _ in range(n): asyncio.create_task(worker())

def submit(fn, payload):
    tid = str(uuid.uuid4())
    _tasks[tid] = {"id":tid,"status":"queued","payload":payload,"fn":fn}
    _q.put_nowait(tid)
    return tid

def status(tid): return _tasks.get(tid, {"id":tid,"status":"not_found"})


def list_tasks(offset: int = 0, limit: int = 50):
    items = list(_tasks.values())
    items.sort(key=lambda x: x.get("id"), reverse=True)
    return {"total": len(items), "items": items[offset: offset+limit]}

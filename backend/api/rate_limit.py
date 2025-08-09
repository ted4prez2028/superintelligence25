import time, os
from collections import defaultdict
from fastapi import Request, HTTPException

TOKENS_PER_MIN = int(os.getenv("RATE_LIMIT_TPM","1200"))
_b = defaultdict(lambda: {"t":TOKENS_PER_MIN,"ts":time.time()})

def allow(request: Request, cost: int = 1):
    ip = request.client.host if request.client else "unknown"
    b = _b[ip]; now = time.time(); dt = now - b["ts"]
    refill = (TOKENS_PER_MIN/60.0)*dt
    b["t"] = min(TOKENS_PER_MIN, b["t"] + refill); b["ts"] = now
    if b["t"] >= cost: b["t"] -= cost; return True
    raise HTTPException(429, "Rate limit exceeded")

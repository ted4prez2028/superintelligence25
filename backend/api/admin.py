import os, json, logging
from typing import Dict, Any

logger = logging.getLogger("admin")

# Simple agent registry held in-memory + persisted to disk
REGISTRY_PATH = os.getenv("AGENT_REGISTRY_PATH", "data/agents.json")

def _load_agents() -> Dict[str, Any]:
    if not os.path.exists(REGISTRY_PATH): return {}
    try:
        with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_agents(data: Dict[str, Any]):
    os.makedirs(os.path.dirname(REGISTRY_PATH), exist_ok=True)
    with open(REGISTRY_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def list_agents():
    return _load_agents()

def upsert_agent(agent_id: str, data: Dict[str, Any]):
    reg = _load_agents()
    reg[agent_id] = data
    _save_agents(reg)
    return {"ok": True}

def delete_agent(agent_id: str):
    reg = _load_agents()
    reg.pop(agent_id, None)
    _save_agents(reg)
    return {"ok": True}

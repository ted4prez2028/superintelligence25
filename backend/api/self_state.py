import json, os, threading

STATE_FILE = os.getenv("SELF_STATE","self_state.json")
_lock = threading.Lock()

def load():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE,"r",encoding="utf-8") as f:
            return json.load(f)
    return {}

def update(reflection: str):
    with _lock:
        state = load()
        state["last_reflection"] = reflection
        with open(STATE_FILE,"w",encoding="utf-8") as f:
            json.dump(state,f,indent=2)


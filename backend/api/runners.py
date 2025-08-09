import os
from dotenv import load_dotenv
load_dotenv()
from typing import Dict, Any
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def _chat(prompt: str, system: str) -> str:
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"system","content":system},{"role":"user","content":prompt}],
        temperature=0.2
    )
    return r.choices[0].message.content

async def run_planning(payload: Dict[str, Any]):
    ctx = payload.get("context","Plan the task")
    out = await _chat(f"Plan step-by-step: {ctx}", "You write concise, actionable plans.")
    return {"plan": out}

async def run_evaluation(payload: Dict[str, Any]):
    target = payload.get("target")
    out = await _chat(f"Evaluate the following for quality and correctness:\n{target}", "You are a rigorous evaluator.")
    return {"evaluation": out}

async def run_self_model(payload: Dict[str, Any]):
    about = payload.get("about","the system")
    out = await _chat(f"Self-assess capabilities, limits, and next steps regarding {about}.", "You perform introspective analysis.")
    return {"self_model": out}

async def run_policy_loops(payload: Dict[str, Any]):
    goals = payload.get("goals", [])
    out = await _chat(f"Given goals: {goals}. Propose policy loop iterations with metrics.", "You propose iterative policy loops.")
    return {"policy_loops": out}

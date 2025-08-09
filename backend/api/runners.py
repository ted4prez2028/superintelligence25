import os
from dotenv import load_dotenv
load_dotenv()
from typing import Dict, Any
from openai import AsyncOpenAI
from . import memory, safety

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TOOLS = [
    {"type": "function",
     "function": {
       "name": "memory.search",
       "description": "retrieve relevant documents",
       "parameters": {"type": "object","properties":{"query":{"type":"string"}}}}},
    {"type": "function",
     "function": {
       "name": "memory.write",
       "description": "store new facts",
       "parameters": {"type": "object","properties":{"id":{"type":"string"},"text":{"type":"string"}}}}}
]

async def _chat(prompt: str, system: str, tools=TOOLS) -> str:
    """High-reasoning chat with tool use and safety checks."""
    resp = await client.responses.create(
        model="gpt-4o-reasoning",
        input=[{"role":"system","content":system},
               {"role":"user","content":prompt}],
        tools=tools,
        temperature=0.2,
    )
    text = resp.output[0].content[0].text
    safety.enforce(text)
    return text

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
    out = await _chat(
        f"Update the persistent self-model about {about}.",
        "You perform truthful introspection.",
    )
    from . import self_state
    self_state.update(out)
    return {"self_model": out}

async def run_policy_loops(payload: Dict[str, Any]):
    goals = payload.get("goals", [])
    out = await _chat(f"Given goals: {goals}. Propose policy loop iterations with metrics.", "You propose iterative policy loops.")
    return {"policy_loops": out}

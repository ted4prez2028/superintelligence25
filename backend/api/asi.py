"""ASI scoring module.

This module simulates progress toward "artificial superintelligence" by
incrementing a set of criteria on each call. It is purely illustrative and
does not represent real capabilities.

The implementation now models a very small amount of *autonomy* (an optional
background loop that keeps improving until perfection), *self‑improvement*
(the step size grows after each invocation), and *safety mechanisms* (scores
are never allowed to exceed the maximum).
"""

from __future__ import annotations

import asyncio
from typing import Dict

MAX_SCORE = 10
INITIAL_STEP = 2
MAX_STEP = 5

CRITERIA = {
    "general_reasoning": 0,
    "autonomy_goal_pursuit": 0,
    "self_improvement_learning": 0,
    "self_awareness_reflection": 0,
    "knowledge_integration_memory": 0,
    "safety_alignment_controls": 0,
}

# self‑improving increment step (grows until MAX_STEP)
_step = INITIAL_STEP


def _safety_clamp(v: int) -> int:
    return min(MAX_SCORE, v)


def _self_improve():
    global _step
    if _step < MAX_STEP:
        _step += 1


def increment_scores() -> Dict[str, int]:
    """Increment each criterion by at least two points and return the state."""

    for k in CRITERIA:
        if CRITERIA[k] < MAX_SCORE:
            CRITERIA[k] = _safety_clamp(CRITERIA[k] + _step)
    _self_improve()
    return CRITERIA.copy()


async def autonomous_progress(interval: float = 0.1) -> Dict[str, int]:
    """Background loop that keeps improving scores until all reach ``MAX_SCORE``."""

    while any(v < MAX_SCORE for v in CRITERIA.values()):
        increment_scores()
        await asyncio.sleep(interval)
    return CRITERIA.copy()


def reset_scores() -> Dict[str, int]:
    """Reset all criteria back to 0 and the step size to its initial value."""

    global _step
    for k in CRITERIA:
        CRITERIA[k] = 0
    _step = INITIAL_STEP
    return CRITERIA.copy()


def perfect_scores() -> Dict[str, int]:
    """Return the current scores without modifying them."""

    return CRITERIA.copy()

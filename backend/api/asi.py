"""ASI scoring module.

This module simulates progress toward "artificial superintelligence" by
incrementing a set of criteria on each call. It is purely illustrative and
does not represent real capabilities.
"""

from typing import Dict

MAX_SCORE = 10

CRITERIA = {
    "general_reasoning": 0,
    "autonomy_goal_pursuit": 0,
    "self_improvement_learning": 0,
    "self_awareness_reflection": 0,
    "knowledge_integration_memory": 0,
    "safety_alignment_controls": 0,
}


def increment_scores() -> Dict[str, int]:
    """Increment each criterion by 1 up to ``MAX_SCORE`` and return the state."""

    for k in CRITERIA:
        if CRITERIA[k] < MAX_SCORE:
            CRITERIA[k] += 1
    return CRITERIA.copy()


def reset_scores() -> Dict[str, int]:
    """Reset all criteria back to 0."""

    for k in CRITERIA:
        CRITERIA[k] = 0
    return CRITERIA.copy()


def perfect_scores() -> Dict[str, int]:
    """Return the current scores without modifying them."""

    return CRITERIA.copy()

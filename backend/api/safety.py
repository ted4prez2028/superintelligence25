import os
from openai import OpenAI

moderation = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
ALLOWED_SHELL = {"ls","cat","python","pip","git"}

def enforce(text: str):
    """Raise if content violates policy."""
    result = moderation.moderations.create(model="omni-moderation-latest", input=text)
    if result.results[0].flagged:
        raise ValueError("Output failed moderation")

def allow_shell(cmd: str):
    if cmd.split()[0] not in ALLOWED_SHELL:
        raise ValueError("disallowed command")


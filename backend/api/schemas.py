from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ChatIn(BaseModel):
    message: str
    sessionId: Optional[str] = None

class ChatOut(BaseModel):
    message: str
    sessionId: Optional[str] = None

class ToolInvoke(BaseModel):
    name: str
    args: Dict[str, Any] = {}

class TaskSubmit(BaseModel):
    type: str
    payload: Dict[str, Any] = {}

class TaskStatus(BaseModel):
    id: str
    status: str
    result: Optional[Any] = None
    error: Optional[str] = None

class VectorUpsert(BaseModel):
    id: str
    text: str

class VectorQuery(BaseModel):
    query: str
    top_k: int = 5

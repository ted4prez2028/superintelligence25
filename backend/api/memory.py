import os
from typing import Dict, List
from openai import OpenAI
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, String, create_engine, select
from sqlalchemy.orm import declarative_base, Session

ENGINE = create_engine(os.getenv("PGVECTOR_URL","sqlite:///memory.db"))
Base = declarative_base()

class Memory(Base):
    __tablename__ = "vectors"
    id = Column(String, primary_key=True)
    text = Column(String)
    embedding = Column(Vector(1536))

Base.metadata.create_all(ENGINE)

def _embed(text: str) -> List[float]:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    r = client.embeddings.create(model="text-embedding-3-small", input=text)
    return r.data[0].embedding

def upsert(id: str, text: str) -> Dict:
    e = _embed(text)
    with Session(ENGINE) as s:
        s.merge(Memory(id=id, text=text, embedding=e))
        s.commit()
    return {"id": id}

def query(text: str, top_k: int = 5) -> Dict:
    q = _embed(text)
    stmt = select(Memory).order_by(Memory.embedding.l2_distance(q)).limit(top_k)
    with Session(ENGINE) as s:
        rows = s.scalars(stmt).all()
    return {"results": [{"id": r.id, "text": r.text} for r in rows]}


def all_vectors(limit: int = 200):
    stmt = select(Memory).limit(limit)
    with Session(ENGINE) as s:
        rows = s.scalars(stmt).all()
    out = []
    for r in rows:
        out.append({"id": r.id, "text": r.text, "embedding": list(r.embedding)})
    return {"items": out}

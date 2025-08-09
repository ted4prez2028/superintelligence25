# Superintelligence API (FastAPI)

- Port: `8080`
- OpenAPI docs: `/docs`
- WS streaming: `ws://localhost:8080/ws/chat`

## Setup
```bash
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# set OPENAI_API_KEY, CLERK_ISSUER, CLERK_JWKS_URL, etc.
uvicorn api.server:app --host 0.0.0.0 --port 8080 --reload
```

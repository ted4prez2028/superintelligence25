# superintelligence25

This project is a small demonstration stack combining a FastAPI backend and a React
frontend to experiment with LLM‑powered agents. **It is not an artificial
superintelligence** but a playground for exploring planning, evaluation and basic
tool execution using external language models.

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.server:app --reload
```

Environment variables:

- `OPENAI_API_KEY` – API key for OpenAI models.

The backend exposes two toy endpoints:

* `GET /asi/score` – increases a set of "ASI" ratings by **at least two points**
  per request. The step size grows on each call to mimic self‑improvement and
  values are safely clamped at ten.
* `POST /asi/auto` – an autonomous loop that keeps calling the incrementer in
  the background until every criterion hits ten.

These numbers merely simulate progress and do not indicate real
superintelligence or autonomy.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server expects the backend to run on the same host under the
`/api` path. Adjust Vite proxy settings in `vite.config.js` if necessary.

## Architecture

* **FastAPI backend** – provides chat, planning runners, vector memory and a
  simple tool executor for experiments.
* **React frontend** – offers a minimal UI to interact with the endpoints.
* **SQLite vector store** – stores embeddings for Retrieval‑Augmented Generation.

## Disclaimer

This repository is a teaching aid for LLM orchestration. The so‑called
autonomy, self‑improvement and safety routines are simplistic placeholders and
should not be confused with the capabilities of a real "superintelligent"
system.

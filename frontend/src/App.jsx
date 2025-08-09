import StatusBar from "./components/StatusBar";
import AgentsPlanner from "./components/AgentsPlanner";
import ExecutePlan from "./components/ExecutePlan";
import RAGPanel from "./components/RAGPanel";
import StreamConsole from "./components/StreamConsole";
import MetricsPane from "./components/MetricsPane";
import Toolbox from "./components/Toolbox";
import "./styles.css";
import { useState } from "react";

export default function App() {
  const [lastPlan, setLastPlan] = useState([]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple">
            ASI Command Deck
          </span>
        </h1>
        <p className="text-slate-300 mt-2">
          Orchestrate your Agents. Query knowledge. Stream signals. All on one screen.
        </p>
      </header>

      <div className="grid gap-6">
        <StatusBar />
        <Toolbox />
        <AgentsPlanner onPlanned={setLastPlan} />
        <ExecutePlan plan={lastPlan} />
        <RAGPanel />
        <StreamConsole />
        <MetricsPane />
      </div>

      <footer className="mt-10 text-center text-xs text-slate-400">
        Built for speed & safety • Tailwind + React • Same‑host API compatible
      </footer>
    </div>
  );
}
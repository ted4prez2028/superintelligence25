import React, { useState } from 'react';
import Shell from '../ui/Shell';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { API } from '../api';

export default function Admin(){
  const [planningCtx, setPlanningCtx] = useState('');
  const [evaluationInput, setEvaluationInput] = useState('{}');
  const [policyGoals, setPolicyGoals] = useState('[]');
  const [selfAbout, setSelfAbout] = useState('system state');
  const [out, setOut] = useState('');

  async function runPlanning(){ setOut(JSON.stringify(await API.runPlanning({ context: planningCtx }), null, 2)); }
  async function runEvaluation(){ setOut(JSON.stringify(await API.runEvaluation({ target: JSON.parse(evaluationInput) }), null, 2)); }
  async function runSelfModel(){ setOut(JSON.stringify(await API.runSelfModel({ about: selfAbout }), null, 2)); }
  async function runPolicyLoops(){ setOut(JSON.stringify(await API.runPolicyLoops({ goals: JSON.parse(policyGoals) }), null, 2)); }

  return (<Shell title="Runners">
    <div className="grid xl:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card title="Planning"><Textarea rows={6} value={planningCtx} onChange={(e)=>setPlanningCtx(e.target.value)} /><div className="flex justify-end"><Button variant="primary" onClick={runPlanning}>Run Planning</Button></div></Card>
        <Card title="Self Model"><Input value={selfAbout} onChange={(e)=>setSelfAbout(e.target.value)} /><div className="flex justify-end"><Button variant="primary" onClick={runSelfModel}>Run Self Model</Button></div></Card>
      </div>
      <div className="space-y-6">
        <Card title="Evaluation (JSON)"><Textarea rows={6} value={evaluationInput} onChange={(e)=>setEvaluationInput(e.target.value)} className="font-mono text-sm" /><div className="flex justify-end"><Button variant="primary" onClick={runEvaluation}>Run Evaluation</Button></div></Card>
        <Card title="Policy Loops (JSON)"><Textarea rows={6} value={policyGoals} onChange={(e)=>setPolicyGoals(e.target.value)} className="font-mono text-sm" /><div className="flex justify-end"><Button variant="primary" onClick={runPolicyLoops}>Run Policy Loops</Button></div></Card>
      </div>
    </div>
    <div className="mt-6"><Card title="Output"><pre className="min-h-[260px] w-full bg-black/50 border border-white/10 rounded-xl p-4 overflow-auto">{out}</pre></Card></div>
  </Shell>);
}

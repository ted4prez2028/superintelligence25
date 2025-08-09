import React from 'react';
import { NavLink } from 'react-router-dom';
export default function Shell({ title='Dashboard', children }){
  return(<div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
    <aside className="hidden lg:flex flex-col bg-surface/80 backdrop-blur-xs border-r border-white/10">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_0_1px_rgba(124,92,255,.45),0_12px_50px_rgba(124,92,255,.28)]"><span className="font-black">A</span></div>
        <div className="ml-3"><div className="text-lg font-extrabold tracking-wide">ASI Admin</div><div className="text-xs text-white/50">Superintelligence Console</div></div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Section label="Operate">
            <Item to="/jobs" label="Jobs" /><Item to="/dashboard" label="Dashboard" /><Item to="/" label="Chat" /><Item to="/admin" label="Runners" /><Item to="/goals" label="Goal Queue" /></Section>
        <Section label="Memory"><Item to="/memory" label="Vectors" /><Item to="/showcase" label="Showcase" /></Section>
      </nav>
      <div className="p-4 text-xs text-white/40">v3 • Tailwind v4 tokens</div>
    </aside>
    <main className="relative"><div className="sticky top-0 z-10 bg-gradient-to-b from-surface/90 to-transparent backdrop-blur-xs border-b border-white/10"><div className="h-16 px-4 lg:px-8 flex items-center justify-between"><h1 className="text-xl font-bold tracking-tight">{title}</h1></div></div><div className="p-4 lg:p-8">{children}</div></main>
  </div>);
}
function Section({label,children}){return(<div className="space-y-2"><div className="px-3 text-[11px] uppercase tracking-wider text-white/40">{label}</div><div className="grid gap-2">{children}</div></div>);}
function Item({to,label}){return(<NavLink to={to} className={({isActive})=>`group px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[.03] hover:bg-white/[.06] transition ${isActive?'border-primary/50 bg-primary/10 shadow-[0_0_0_1px_rgba(124,92,255,.45),0_12px_50px_rgba(124,92,255,.28)]':''}`}><div className="flex items-center justify-between"><div className="font-medium">{label}</div><div className="opacity-0 group-hover:opacity-100 transition text-white/60 text-xs">→</div></div></NavLink>);}

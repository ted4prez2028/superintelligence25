export function Section({ title, children, right }) {
  return (
    <section className="card p-5 shadow-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-blue">
            {title}
          </span>
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}
export function Code({ children }) {
  return (
    <pre className="overflow-auto text-sm leading-relaxed p-4 rounded-xl bg-black/60 border border-slate-800">
      <code>{children}</code>
    </pre>
  );
}
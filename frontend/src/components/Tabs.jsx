
import { useState } from "react";

export default function Tabs({ tabs = [], initial = 0, onChange }) {
  const [i, setI] = useState(initial);
  return (
    <div className="tabs">
      {tabs.map((t, idx) => (
        <button
          key={idx}
          className={`tab ${idx === i ? "tab-active" : ""}`}
          onClick={() => { setI(idx); onChange?.(idx); }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

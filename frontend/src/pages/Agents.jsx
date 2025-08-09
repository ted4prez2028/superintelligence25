import React, { useState } from "react";

export default function Agents() {
  return (
    <div style={{ fontFamily: "ui-sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Agent Registry</h1>
      <p>Placeholder UI: wire to backend registry if needed. (API endpoints can be added similarly to vectors and runners.)</p>
      <ul style={{ marginTop: 12 }}>
        <li>List agents</li>
        <li>Add/update agent</li>
        <li>Delete agent</li>
      </ul>
      <div style={{ marginTop: 24 }}>
        <a href="/admin">Admin</a>
      </div>
    </div>
  );
}

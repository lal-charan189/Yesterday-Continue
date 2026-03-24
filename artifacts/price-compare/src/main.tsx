import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[v0] main.tsx loading");

const rootEl = document.getElementById("root");
console.log("[v0] root element:", rootEl);

if (rootEl) {
  console.log("[v0] Creating React root");
  createRoot(rootEl).render(<App />);
  console.log("[v0] App rendered");
}

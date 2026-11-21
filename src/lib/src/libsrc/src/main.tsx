import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    {/* HashRouter keeps page refreshes working on GitHub Pages,
        e.g. https://jacksonlumumba2026-web.github.io/Webmanager-pro/#/login */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);

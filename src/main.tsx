import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// App entry point: mounts the React app inside <div id="root"> from index.html.
// StrictMode runs extra checks in development only (it does nothing in production).
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

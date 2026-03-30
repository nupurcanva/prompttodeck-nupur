import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

function getBasename(): string {
  const { host, pathname } = window.location;

  if (pathname.endsWith("/index.html")) {
    const newPath = pathname.slice(0, -10) + (window.location.search || "");
    window.history.replaceState({}, "", newPath);
  }

  const envBasePath = import.meta.env.VITE_BASE_PATH;
  if (envBasePath) {
    return envBasePath;
  }

  if (pathname.startsWith("/canva-editor")) {
    return "/canva-editor";
  }

  if (host === "flyingfox.canva-experiments.com") {
    return pathname.replace("/index.html", "");
  }

  return "/";
}

const basename = getBasename();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

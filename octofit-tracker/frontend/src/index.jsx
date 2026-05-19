import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";

const codespaceName = import.meta.env.VITE_REACT_APP_CODESPACE_NAME || import.meta.env.REACT_APP_CODESPACE_NAME;
console.log("OctoFit Tracker frontend starting");
console.log("Codespace environment name:", codespaceName);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Pastikan path ini sesuai lokasi file App.js kamu
import "./index.css"; // Optional, jika kamu punya styling global

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

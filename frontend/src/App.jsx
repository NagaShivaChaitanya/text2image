import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="noise-bg min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/2 rounded-full blur-3xl" />
      </div>
      <Header />
      <Home />
      <footer className="relative z-10 border-t border-border px-6 py-6 text-center">
        <p className="text-xs text-muted font-mono" style={{ fontFamily: "JetBrains Mono" }}>
          Promptforge — powered by Hugging Face Stable Diffusion
        </p>
      </footer>
    </div>
  );
}

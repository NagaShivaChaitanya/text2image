import React, { useState } from "react";

const SUGGESTIONS = [
  "A cyberpunk city at dusk, neon lights reflecting on wet streets",
  "An ancient library floating in space, surrounded by nebulae",
  "A solitary lighthouse on a cliff during a stormy night, oil painting style",
  "Bioluminescent forest with glowing mushrooms and fireflies",
];

export default function PromptInput({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }
    setError("");
    onGenerate(prompt.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const applySuggestion = (s) => {
    setPrompt(s);
    setError("");
  };

  return (
    <div className="animate-fade-up">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create..."
          rows={4}
          className="input-focus w-full bg-panel border border-border rounded-xl px-5 py-4 text-white placeholder-muted resize-none text-base leading-relaxed"
          style={{ fontFamily: "DM Sans" }}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="text-xs text-muted font-mono" style={{ fontFamily: "JetBrains Mono" }}>
            {prompt.length}/1000
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
          <span>⚠</span> {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => applySuggestion(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-soft hover:border-accent hover:text-accent transition-all duration-200 font-mono truncate max-w-xs"
            style={{ fontFamily: "JetBrains Mono" }}
            title={s}
          >
            {s.length > 40 ? s.slice(0, 40) + "…" : s}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-generate flex items-center gap-2.5 bg-accent text-void font-display font-700 px-6 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "Syne", fontWeight: 700 }}
        >
          {loading ? (
            <>
              <Spinner />
              Generating image. This may take up to 60 seconds
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L14.5 8L8 14.5M1.5 8H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Generate Image
            </>
          )}
        </button>
        <span className="text-xs text-muted" style={{ fontFamily: "JetBrains Mono" }}>
          ⌘ + Enter
        </span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}

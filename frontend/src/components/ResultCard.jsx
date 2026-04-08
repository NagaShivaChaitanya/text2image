import React, { useState } from "react";

export default function ResultCard({ image, imageUrl, prompt, enhancedPrompt, isNew }) {
  const [copied, setCopied] = useState(false);
  const downloadId = `image-${prompt.slice(0, 24).replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "promptforge"}.png`;
  const src = imageUrl || image;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = downloadId;
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className={`card-hover relative group rounded-2xl overflow-hidden border border-border bg-panel ${isNew ? "animate-scale-in glow-accent" : ""}`}>
      {isNew && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-accent text-void text-xs font-display px-2.5 py-1 rounded-full" style={{ fontFamily: "Syne", fontWeight: 700 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-void animate-pulse-slow" />
          NEW
        </div>
      )}

      <div className="relative aspect-square overflow-hidden">
        <img
          src={src}
          alt="generated"
          style={{ width: "100%", borderRadius: "10px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex gap-2 w-full">
            <button
              onClick={copyPrompt}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg py-2 text-xs text-white hover:bg-white/20 transition-colors"
            >
              {copied ? (
                <><CheckIcon /> Copied!</>
              ) : (
                <><CopyIcon /> Copy Prompt</>
              )}
            </button>
            <button
              onClick={downloadImage}
              className="flex items-center justify-center gap-1.5 bg-accent/90 backdrop-blur-sm rounded-lg py-2 px-3 text-xs text-void font-600 hover:bg-accent transition-colors"
              style={{ fontWeight: 600 }}
              aria-label="Download image"
            >
              <DownloadIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-mono" style={{ fontFamily: "JetBrains Mono" }}>
            Prompt
          </p>
          <p className="text-sm text-soft leading-relaxed line-clamp-2" title={prompt}>
            {prompt}
          </p>
          {enhancedPrompt && (
            <p className="text-xs text-muted leading-relaxed line-clamp-2" title={enhancedPrompt}>
              {enhancedPrompt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2 9V2H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

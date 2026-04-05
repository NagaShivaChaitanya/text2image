import React from "react";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="animate-fade-up flex items-start gap-3 bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-300">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-200 transition-colors shrink-0">✕</button>
    </div>
  );
}

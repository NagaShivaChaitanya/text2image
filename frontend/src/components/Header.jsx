import React from "react";

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="#060608" />
          </svg>
        </div>
        <span className="font-display font-700 text-lg tracking-tight text-white" style={{ fontFamily: "Syne", fontWeight: 700 }}>
          Promptforge
        </span>
      </div>
      <nav className="flex items-center gap-6">
        <a href="#generate" className="text-sm text-soft hover:text-white transition-colors">
          Generate
        </a>
        <a href="#gallery" className="text-sm text-soft hover:text-white transition-colors">
          Gallery
        </a>
        <span className="text-xs font-mono px-2 py-1 rounded border border-border text-muted" style={{ fontFamily: "JetBrains Mono" }}>
          DALL·E 3
        </span>
      </nav>
    </header>
  );
}

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-panel">
      <div className="aspect-square shimmer-skeleton relative flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 z-10">
          <svg className="animate-spin text-accent" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" strokeDasharray="56" strokeDashoffset="20" strokeLinecap="round" opacity="0.3" />
            <circle cx="16" cy="16" r="12" stroke="#c8ff00" strokeWidth="2" strokeDasharray="20" strokeDashoffset="0" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-muted font-mono" style={{ fontFamily: "JetBrains Mono" }}>
            painting your vision...
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-3 rounded shimmer-skeleton w-3/4" />
        <div className="h-3 rounded shimmer-skeleton w-1/2" />
      </div>
    </div>
  );
}

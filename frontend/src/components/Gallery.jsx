import React from "react";
import ResultCard from "./ResultCard";
import LoadingSkeleton from "./LoadingSkeleton";

export default function Gallery({ items, loading, generatingNew, latestId }) {
  if (!generatingNew && items.length === 0 && !loading) {
    return (
      <div className="py-24 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl border border-border flex items-center justify-center mb-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="22" height="22" rx="3" stroke="#4a4a5a" strokeWidth="1.5" />
            <circle cx="10" cy="11" r="2.5" stroke="#4a4a5a" strokeWidth="1.5" />
            <path d="M3 19l6-5 4 4 4-3.5 8 6" stroke="#4a4a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-soft text-sm">Your generated images will appear here</p>
        <p className="text-muted text-xs font-mono" style={{ fontFamily: "JetBrains Mono" }}>
          Enter a prompt above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {generatingNew && <LoadingSkeleton />}
      {items.map((item) => (
        <ResultCard
          key={item.id}
          image={item.image}
          imageUrl={item.imageUrl || item.image}
          prompt={item.prompt}
          enhancedPrompt={item.enhancedPrompt}
          isNew={item.id === latestId}
        />
      ))}
    </div>
  );
}

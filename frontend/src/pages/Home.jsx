import React, { useEffect, useState } from "react";
import PromptInput from "../components/PromptInput";
import Gallery from "../components/Gallery";
import ErrorBanner from "../components/ErrorBanner";
import { useGenerator } from "../hooks/useGenerator";

export default function Home() {
  const { loading, error, result, gallery, galleryLoading, generate, loadGallery } = useGenerator();
  const [localError, setLocalError] = useState(null);
  const [latestId, setLatestId] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  useEffect(() => {
    if (result) setLatestId(result.id);
  }, [result]);

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-20">
      <section id="generate" className="space-y-10">
        <div className="space-y-4 animate-fade-up">
          <div
            className="flex items-center gap-2 text-xs text-accent font-mono tracking-widest uppercase"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            <span className="w-6 h-px bg-accent" />
            AI Image Generation
          </div>
          <h1
            className="text-5xl md:text-6xl font-display text-white leading-[1.05] tracking-tight"
            style={{ fontFamily: "Syne", fontWeight: 800 }}
          >
            Turn words into
            <br />
            <span className="text-accent">visual art.</span>
          </h1>
          <p className="text-soft max-w-xl leading-relaxed stagger-2 animate-fade-up">
            Describe any scene, style, or concept — and watch the prompt turn into
            a generated image with a clean, fast demo flow.
          </p>
        </div>

        <div className="stagger-3 animate-fade-up space-y-4">
          {localError && (
            <ErrorBanner
              message={localError}
              onDismiss={() => setLocalError(null)}
            />
          )}
          <PromptInput onGenerate={generate} loading={loading} />
        </div>
      </section>

      <section id="gallery" className="space-y-6 stagger-4 animate-fade-up">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2
            className="text-xl text-white"
            style={{ fontFamily: "Syne", fontWeight: 700 }}
          >
            Generation History
          </h2>
          <span
            className="text-xs text-muted font-mono"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            {gallery.length} image{gallery.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Gallery
          items={gallery}
          loading={galleryLoading}
          generatingNew={loading}
          latestId={latestId}
        />
      </section>
    </main>
  );
}

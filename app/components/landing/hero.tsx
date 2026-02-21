import { useState } from "react";

import { ArrowUpRight, Play } from "lucide-react";

import { Button } from "../ui/button";
import { GeometricArt } from "./geometric-art";

export const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-20">
      {/* Subtle grid overlay - darker in light mode */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: "96px 96px",
        }}
        aria-hidden="true"
      />

      {/* Central glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(109,234,249,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Top badge */}
      <div className="relative z-10 mb-10 mt-8 lg:mt-0">
        <a
          href="#"
          className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/60 backdrop-blur-sm px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
            Lab 001 -- Launching May 4, 2026
          </span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Headline block */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-primary mb-5">
          The Next Frontier of Performance
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem] leading-[1.06]">
          {"Data-driven mastery for "}
          <span className="text-primary">disc golf</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[15px] text-muted-foreground leading-relaxed">
          Build your foundation with science-backed coaching, flight-path
          analytics, and cognitive training. Where the mind-body connection
          meets the fairway.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex items-center justify-center gap-4">
          <Button asChild className="shadow-[0_0_24px_rgba(109,234,249,0.2)]">
            <a
              href="#"
              className="text-[13px] font-bold tracking-wide uppercase px-7 py-3"
            >
              Request Access
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="#"
              className="text-[13px] font-bold tracking-wide uppercase px-7 py-3"
            >
              Methodology
            </a>
          </Button>
        </div>
      </div>

      {/* Video section with geometric art as full background */}
      <div className="relative z-10 mt-20 w-full px-6 pb-12 lg:pb-24">
        {/* Mobile: just the video */}
        <div className="lg:hidden mx-auto max-w-lg">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-card shadow-[0_0_40px_rgba(109,234,249,0.08)]">
            <VideoPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
          </div>
        </div>

        {/* Desktop: full-width geometric art background + video centered */}
        <div className="hidden lg:block relative h-[450px]">
          {/* Full-width geometric art background */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full">
              <GeometricArt side="left" />
            </div>
            <div className="w-1/2 h-full">
              <GeometricArt side="right" />
            </div>
          </div>

          {/* Video player centered on top */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[400px]">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-card shadow-[0_0_60px_rgba(109,234,249,0.15)]">
                <VideoPlayer
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                />
              </div>
              {/* Video label */}
              <p className="mt-3 text-center font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                Lab Preview -- Session 001
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VideoPlayer = ({
  isPlaying,
  setIsPlaying,
}: {
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}) => {
  return (
    <>
      {!isPlaying ? (
        <Button
          variant="ghost"
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-card group cursor-pointer w-full h-full rounded-lg"
          aria-label="Play video"
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,234,249,0.06),transparent_70%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center h-14 w-14 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm group-hover:bg-primary/20 transition-all group-hover:scale-105">
                <Play className="h-5 w-5 text-primary fill-primary" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">
                Watch Preview
              </span>
            </div>
          </div>
        </Button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
          title="Disc Golf Lab Preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </>
  );
};

export const CtaSection = () => {
  return (
    <section className="relative bg-background py-24 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(109,234,249,0.04)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary mb-4">
          Session 001
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ready to enter the lab?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-[15px] leading-relaxed">
          Join the next generation of disc golfers building their game on a
          foundation of data, cognitive science, and relentless refinement.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3.5 text-[13px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors tracking-wide uppercase shadow-[0_0_30px_rgba(109,234,249,0.25)]"
          >
            Request Access
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card/50 backdrop-blur-sm px-8 py-3.5 text-[13px] font-bold text-foreground hover:bg-card/80 transition-colors tracking-wide uppercase"
          >
            View Roadmap
          </a>
        </div>
      </div>
    </section>
  );
};

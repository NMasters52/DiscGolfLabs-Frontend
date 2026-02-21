import { Button } from "../ui/button";

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
          <Button asChild className="shadow-[0_0_30px_rgba(109,234,249,0.25)]">
            <a
              href="#"
              className="text-[13px] font-bold tracking-wide uppercase px-8 py-3.5"
            >
              Request Access
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="#"
              className="text-[13px] font-bold tracking-wide uppercase px-8 py-3.5"
            >
              View Roadmap
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

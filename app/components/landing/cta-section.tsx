import { Button } from "../ui/button";
import { WaitlistForm } from "./waitlist-form";

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
          Limited Access
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ready to take your game to the lab?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-[15px] leading-relaxed">
          Beta testing starts May 4. Join the waitlist for early access.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <WaitlistForm source="cta" showCount={true} />
          <Button variant="outline" asChild>
            <a
              href="#"
              className="text-[13px] font-bold tracking-wide uppercase px-8 py-3.5"
            >
              See Methodology
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

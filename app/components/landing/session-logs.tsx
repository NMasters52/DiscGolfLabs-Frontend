import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";

const sessionLogs = [
  {
    id: "LOG_024",
    name: "Marcus Chen",
    pdgaNumber: "85247",
    outcome: "+45ft Accuracy",
    hand: "RHBH",
    experience: "8 Years",
    report:
      "Identified a 4-degree nose-angle variance that was killing my distance. The data doesn't lie; once I saw the number, the fix was immediate.",
    status: "VERIFIED_USER",
  },
  {
    id: "LOG_089",
    name: "Derek Simmons",
    pdgaNumber: "71032",
    outcome: "C2 Stability",
    hand: "RHBH",
    experience: "12 Years",
    report:
      "Tournament nerves used to wreck my timing. The Pressure Practice modules allowed me to simulate the heart rate spike of a lead card. My mechanics finally hold up.",
    status: "VERIFIED_USER",
  },
  {
    id: "LOG_156",
    name: "Lisa Petrova",
    pdgaNumber: null,
    outcome: "-3 Strokes/Round",
    hand: "LHBH",
    experience: "15 Years",
    report:
      "The adaptive training identified a gap in my headwind approach game. After 3 focused sessions, my upwind distance control improved dramatically.",
    status: "VERIFIED_USER",
  },
  {
    id: "LOG_201",
    name: "James Wright",
    pdgaNumber: "98421",
    outcome: "Form Retention",
    hand: "RHBH",
    experience: "4 Years",
    report:
      "I used to rebuild my form every off-season. The progressive overload system gave me a baseline that actually sticks. First spring without starting from zero.",
    status: "VERIFIED_USER",
  },
];

export const SessionLogs = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="relative bg-background py-24 lg:py-32 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(109,234,249,0.03)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">
            Session Logs
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Measurable results. No hype.
          </h2>
          <p className="mt-4 text-muted-foreground text-[15px] leading-relaxed">
            Real data from real players. Each log represents a documented
            breakthrough.
          </p>
        </div>

        {/* Carousel container */}
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {sessionLogs.map((log) => (
              <CarouselItem
                key={log.id}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/2"
              >
                <div className="h-full bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 transition-all hover:border-primary/30 hover:shadow-[0_0_40px_rgba(109,234,249,0.06)]">
                  {/* Top row: Status */}
                  <div className="flex items-center justify-end mb-4">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-primary/70">
                      {log.status}
                    </span>
                  </div>

                  {/* Hero metric */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary tracking-tight">
                      {log.outcome}
                    </span>
                  </div>

                  {/* Metadata chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/5 border border-primary/15 font-mono text-[11px] tracking-wide text-muted-foreground">
                      {log.hand}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/5 border border-primary/15 font-mono text-[11px] tracking-wide text-muted-foreground">
                      {log.experience}
                    </span>
                    {log.pdgaNumber && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/5 border border-primary/15 font-mono text-[11px] tracking-wide text-muted-foreground">
                        PDGA #{log.pdgaNumber}
                      </span>
                    )}
                  </div>

                  {/* Report */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    "{log.report}"
                  </p>

                  {/* Player name */}
                  <div className="mt-auto pt-2 border-t border-border/50">
                    <span className="text-sm font-medium text-foreground">
                      — {log.name}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation arrows - visible on larger screens */}
          <CarouselPrevious className="hidden md:flex left-4 lg:left-8 size-12 rounded-full border-border bg-card/80 backdrop-blur-sm text-muted-foreground cursor-pointer hover:text-foreground hover:border-accent" />
          <CarouselNext className="hidden md:flex right-4 lg:right-8 size-12 rounded-full border-border bg-card/80 backdrop-blur-sm text-muted-foreground cursor-pointer hover:text-foreground hover:border-accent" />
        </Carousel>

        {/* Progress bar */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex gap-1.5">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === current - 1 ? "w-8 bg-primary" : "w-2 bg-primary/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

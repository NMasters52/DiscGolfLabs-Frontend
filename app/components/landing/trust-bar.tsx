const logos = [
  "PDGA",
  "Innova",
  "Discraft",
  "MVP",
  "Discmania",
  "Dynamic Discs",
  "Latitude 64",
  "Kastaplast",
];

export const TrustBar = () => {
  return (
    <section className="relative border-t border-border bg-background py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
          Partnered With
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-16">
          {logos.map((name) => (
            <span
              key={name}
              className="text-base font-bold text-muted-foreground/30 select-none tracking-wider uppercase"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

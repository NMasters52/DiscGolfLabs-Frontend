const stats = [
  { value: "2,400+", label: "Athletes in early access", id: "METRIC 001" },
  { value: "18 holes", label: "Avg. weekly tracked play", id: "METRIC 002" },
  { value: "+23%", label: "Scoring improvement (90d)", id: "METRIC 003" },
  { value: "May 4", label: "Public lab opening", id: "METRIC 004" },
];

export const Stats = () => {
  return (
    <section className="relative border-t border-b border-border bg-card/30 backdrop-blur-sm py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center text-center px-6"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                {stat.id}
              </span>
              <span className="text-3xl font-bold text-primary lg:text-4xl tracking-tight">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

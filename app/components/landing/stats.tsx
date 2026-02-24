const stats = [
  { value: "14+", label: "Years Coaching", id: "METRIC 001" },
  { value: "200+", label: "Private Sessions", id: "METRIC 002" },
  { value: "20+", label: "Clinical Workshops", id: "METRIC 003" },
  { value: "175+", label: "Tournaments Played", id: "METRIC 004" },
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

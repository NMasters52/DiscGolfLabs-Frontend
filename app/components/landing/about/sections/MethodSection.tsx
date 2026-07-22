import { method } from "../data";

/**
 * "The Method" as a divided list (icon + title + body) — carried over from the
 * Gallery design. The museum-style "Plate" label is replaced with the house
 * eyebrow for cohesion with the other landing pages.
 */
export function MethodSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
        The Method
      </p>
      <div className="mt-12 flex flex-col divide-y divide-border">
        {method.map((item) => (
          <div key={item.id} className="flex items-start gap-5 py-6">
            <item.icon className="mt-1 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

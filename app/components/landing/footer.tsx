const footerLinks = {
  Platform: [
    "Throw Analysis",
    "Flight Modeling",
    "Cognitive Lab",
    "Disc Library",
    "Changelog",
  ],
  Learn: ["Methodology", "Blog", "Research Notes", "Coaching Tips", "Podcast"],
  Company: ["About", "Careers", "Press", "Partners", "Contact"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a
              href="#"
              className="flex items-center gap-2.5"
              aria-label="Disc Golf Lab home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-card border border-border">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="7"
                    stroke="#6deaf9"
                    strokeWidth="1.2"
                  />
                  <ellipse
                    cx="10"
                    cy="10"
                    rx="4"
                    ry="1.5"
                    stroke="#6deaf9"
                    strokeWidth="0.8"
                    opacity="0.5"
                  />
                  <line
                    x1="10"
                    y1="3"
                    x2="10"
                    y2="0"
                    stroke="#2fd463"
                    strokeWidth="1.2"
                  />
                  <circle cx="10" cy="0" r="1" fill="#2fd463" opacity="0.6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-bold tracking-wide uppercase leading-tight">
                  Disc Golf Lab
                </span>
                <span className="text-[8px] font-mono text-muted-foreground tracking-[0.25em] uppercase leading-tight">
                  Foundation First
                </span>
              </div>
            </a>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Where science meets the fairway. Premium sports-tech for the next
              generation of disc golf.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-border pt-8 lg:flex-row lg:justify-between">
          <p className="text-[11px] font-mono text-muted-foreground tracking-wide">
            {"2026 Disc Golf Lab. All rights reserved."}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

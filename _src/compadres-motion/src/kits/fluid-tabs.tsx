/*
 * Adapted from Watermelon UI "Fluid Tabs" (https://ui.watermelon.sh), MIT License,
 * Copyright (c) 2026 Watermelon Platform Contributors.
 * Changes: real ARIA tabs (tablist/tab/tabpanel, roving tabindex, arrow keys),
 * visible focus ring, no blur flash, colours passed in, icons removed.
 */
import { useId, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

export interface FluidTab {
  id: string;
  label: string;
  panel: ReactNode;
}

export function FluidTabs({ tabs, label }: { tabs: FluidTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, dir: number) => {
    const next = (from + dir + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="relative inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white p-1"
      >
        {tabs.map((tab, i) => {
          const on = active === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-panel-${tab.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); move(i, 1); }
                if (e.key === "ArrowLeft") { e.preventDefault(); move(i, -1); }
                if (e.key === "Home") { e.preventDefault(); move(0, 0); }
                if (e.key === "End") { e.preventDefault(); move(tabs.length - 1, 0); }
              }}
              className="relative min-h-11 rounded-full px-5 py-2.5 text-base font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {on && (
                <motion.span
                  layoutId={`${base}-pill`}
                  transition={{ type: "spring", stiffness: 280, damping: 25, mass: 0.8 }}
                  className="absolute inset-0 rounded-full bg-ink"
                  aria-hidden="true"
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${on ? "text-cream" : "text-ink-2"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${base}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={active !== tab.id}
          tabIndex={0}
          className="mt-4 rounded-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}

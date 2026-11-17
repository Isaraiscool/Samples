import { useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { animate, stagger } from "animejs";
import { TextEffect } from "./kits/text-effect";
import { InView } from "./kits/in-view";
import SplitFlapText from "./kits/split-flap-text";
import { FluidTabs } from "./kits/fluid-tabs";
import pizzaSvg from "./pizza.svg.txt?raw";

const MAP =
  "https://www.google.com/maps/search/?api=1&query=Compadres+Street+Tacos+Knoxville&query_place_id=ChIJx0abAAAlXIgRM5qIwjC6tHo";
const TEL = "tel:+18652559625";

const BIRRIA = ["Quesabirria", "Ramenbirria", "Tortabirria", "Pizzabirria", "Burritobirria", "Quesitacos"];
const CLASSICS = ["Tacos", "Taco plate", "Burritos", "Quesadillas", "Chorizo dip", "Nachos"];
const BOARD = ["QUESABIRRIA", "RAMENBIRRIA", "PIZZABIRRIA", "TORTABIRRIA", "TACOS", "NACHOS"];

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-[1.125rem] flex-none" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-[1.125rem] flex-none" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

const reveal = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

function Section({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <InView variants={reveal} transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }} viewOptions={{ once: true, margin: "0px 0px -10% 0px" }} once>
      <section aria-labelledby={id} className="mx-auto max-w-[70rem] px-6 pt-14 md:px-8">
        {children}
      </section>
    </InView>
  );
}

function MenuBoard() {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [i, setI] = useState(0);
  const still = paused || !!reduce;

  useEffect(() => {
    if (still) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % BOARD.length), 3200);
    return () => window.clearInterval(t);
  }, [still]);

  return (
    <div className="rounded-2xl bg-ink p-5 text-cream sm:p-6">
      <div aria-hidden="true" className="overflow-hidden">
        <SplitFlapText
          text={BOARD[i]}
          length={11}
          className="text-[clamp(1.25rem,5.4vw,2.75rem)] font-semibold"
          tileClassName="bg-[#2B2622] text-[#F7C531]"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cream-2">Dishes from their menu board, one at a time</p>
        {!reduce && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((p) => !p)}
            className="min-h-11 rounded-lg border border-cream/40 px-4 text-sm font-semibold text-cream hover:bg-cream/10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            {paused ? "Play the board" : "Pause the board"}
          </button>
        )}
      </div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-ink">
      {items.map((x) => (
        <li key={x} className="border-b border-line py-3.5 font-display text-xl font-semibold">{x}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const reduce = useReducedMotion();
  const art = useRef<HTMLDivElement>(null);

  // anime.js: the papel picado flags swing three times on load, then stay still.
  useEffect(() => {
    if (reduce || !art.current) return;
    const flags = art.current.querySelectorAll(".flag");
    const a = animate(flags, {
      rotate: [{ to: 6 }, { to: -5 }, { to: 0 }],
      duration: 1400,
      delay: stagger(90),
      loop: 1,
      ease: "inOutSine",
    });
    return () => { a.revert(); };
  }, [reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="absolute -left-[999px] top-0 z-30 bg-white px-4 py-3 font-semibold text-ink focus:left-2 focus:top-2">Skip to content</a>
      <aside aria-label="Sample notice" className="border-b border-line bg-white py-2 text-sm text-ink-2">
        <div className="mx-auto max-w-[70rem] px-6 md:px-8">Sample design, motion test version. Not the official site</div>
      </aside>

      <header className="bg-ink text-cream">
        <div className="mx-auto flex max-w-[70rem] flex-wrap items-center justify-between gap-x-4 px-6 py-5 md:px-8">
          <p className="font-display text-xl font-semibold">Compadres Street Tacos</p>
          <a href={TEL} className="inline-block py-3 text-base font-medium tabular-nums underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream">(865) 255-9625</a>
        </div>
        <div className="mx-auto grid max-w-[70rem] gap-8 px-6 pb-14 pt-4 md:grid-cols-[5fr_6fr] md:items-center md:gap-12 md:px-8 md:pb-16 md:pt-8">
          <div>
            {reduce ? (
              <h1 className="max-w-[15ch] font-display text-[clamp(2.5rem,9vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.015em]">Street tacos and birria on Ebenezer Road</h1>
            ) : (
              <TextEffect as="h1" per="word" preset="fade-in-blur" speedReveal={1.4} className="max-w-[15ch] font-display text-[clamp(2.5rem,9vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.015em]">
                Street tacos and birria on Ebenezer Road
              </TextEffect>
            )}
            <p className="mt-4 max-w-[26rem] text-xl text-cream-2">Compadres Street Tacos, a food truck in Knoxville, Tennessee</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={MAP} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[0.625rem] bg-marigold px-6 text-lg font-semibold text-ink hover:bg-[#FFD75E] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream sm:w-auto">
                <PinIcon />Get directions
              </a>
              <a href={TEL} className="inline-block py-3 font-medium tabular-nums underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cream">Call (865) 255-9625</a>
            </div>
          </div>
          <div ref={art} aria-hidden="true" dangerouslySetInnerHTML={{ __html: pizzaSvg }} />
        </div>
        <div className="picado h-7" aria-hidden="true" />
      </header>

      <main id="main" className="bg-page text-ink">
        <Section id="h-menu">
          <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
            <div>
              <h2 id="h-menu" className="font-display text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight">On the menu board</h2>
              <p className="mb-5 mt-5 text-base font-medium text-ink-2">Read from the photo of the board on their Facebook page</p>
              <MenuBoard />
              <div className="mt-8">
                <FluidTabs
                  label="Menu"
                  tabs={[
                    { id: "birria", label: "Birria", panel: <List items={BIRRIA} /> },
                    { id: "classics", label: "Classics", panel: <List items={CLASSICS} /> },
                  ]}
                />
              </div>
              <p className="mt-3 text-sm text-ink-3">Prices are left off this sample until the owner confirms them</p>
            </div>
            <div>
              <h2 id="h-drive" className="font-display text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight">Before you drive over</h2>
              <p className="mt-5 text-base font-medium text-ink-2">From their Facebook page</p>
              <p className="mt-3 max-w-[22ch] font-display text-2xl font-semibold leading-snug">Call ahead to check the birria has not sold out</p>
              <p className="mt-3 text-sm text-ink-3">Opening days and hours are left off this sample until the owner confirms them</p>
            </div>
          </div>
        </Section>

        <Section id="h-photos">
          <h2 id="h-photos" className="font-display text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight">From the truck</h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 min-[24rem]:grid-cols-2 md:grid-cols-[2fr_1fr] md:grid-rows-2">
            {["The truck on Ebenezer Road", "Pizzabirria", "Tacos"].map((p, k) => (
              <li key={p} className={`grid place-items-center rounded-xl border border-dashed border-ink/40 bg-white p-4 text-center text-sm text-ink-2 [overflow-wrap:anywhere] ${k === 0 ? "aspect-video min-[24rem]:col-span-2 md:col-span-1 md:row-span-2 md:aspect-auto" : "aspect-[4/3] md:aspect-auto md:min-h-44"}`}>
                <span><b className="block text-base font-semibold text-ink">{p}</b>from the owner</span>
              </li>
            ))}
          </ul>
        </Section>

        <div className="mt-14 border-t border-line bg-white py-12">
          <section aria-labelledby="h-call" className="mx-auto grid max-w-[70rem] gap-8 px-6 md:grid-cols-2 md:gap-16 md:px-8">
            <div>
              <h2 id="h-call" className="font-display text-[clamp(1.75rem,5vw,2.25rem)] font-semibold leading-tight">Call the truck</h2>
              <p className="mb-6 mt-2 font-display text-[clamp(2.25rem,10vw,3.5rem)] font-semibold leading-none tabular-nums">(865) 255-9625</p>
              <a href={TEL} className="inline-flex min-h-14 items-center gap-2 rounded-[0.625rem] bg-ink px-6 text-lg font-semibold text-cream hover:bg-[#34302B] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"><PhoneIcon />Call the truck</a>
            </div>
            <dl>
              {[
                ["Find us at", <a key="a" href={MAP} className="inline-block py-2 underline underline-offset-4">600 Ebenezer Rd, Knoxville, TN 37923</a>],
                ["Seating", "Outdoor seating, as listed on their Facebook page"],
                ["Facebook", <a key="f" href="https://www.facebook.com/compadresstacos" className="inline-block py-2 underline underline-offset-4">facebook.com/compadresstacos</a>],
              ].map(([k, v]) => (
                <div key={k as string} className="border-t border-line py-3">
                  <dt className="text-sm text-ink-3">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>

      <footer className="border-t border-line bg-page py-8 text-[0.9375rem] text-ink-2">
        <div className="mx-auto max-w-[70rem] px-6 md:px-8">
          <p>Sample page built for Compadres Street Tacos as a design proposal. It is not run by the business and takes no orders, bookings or payments.</p>
          <p className="mt-2">Motion test built with Motion Primitives, Kokonut UI, Watermelon UI (all MIT) and anime.js.</p>
          <details className="mt-4 rounded-xl border border-line bg-white px-4 py-1">
            <summary className="cursor-pointer py-3 font-semibold text-ink">Details to confirm with the owner</summary>
            <ul className="list-disc pb-3 pl-5">
              <li>The full menu and prices</li>
              <li>Opening days and hours, and the days the birria menu is served</li>
              <li>Whether the truck is always at 600 Ebenezer Rd</li>
              <li>Photos: the owner's own, used with permission</li>
              <li>Address and phone number are from the public Google listing, read 14 Nov 2026</li>
            </ul>
          </details>
        </div>
      </footer>
    </MotionConfig>
  );
}

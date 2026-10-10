import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { IMG, CATEGORY_IMG, COLLECTION_IMG } from "@/lib/images";
import { CATEGORIES, COLLECTIONS, productsQuery, isNew } from "@/lib/shopify";
import { ProductCard, ProductGridSkeleton } from "./ProductCard";
import { useReveal } from "@/hooks/useCartSync";

export function SectionHeading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="reveal mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && <p className="eyebrow mb-4 text-taupe">{eyebrow}</p>}
      <h2 className="text-4xl md:text-6xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-12 lg:py-20">
        <div className="fade-up lg:col-span-6">
          <p className="eyebrow mb-6 text-taupe">The New Season · SAVÉRA</p>
          <h1 className="text-5xl leading-[0.95] md:text-7xl xl:text-8xl">
            Style That Speaks.
            <br />
            <em className="text-taupe">Confidence</em> That Lasts.
          </h1>
          <p className="mt-8 max-w-md text-muted-foreground">
            Discover thoughtfully curated clothing that celebrates your individuality, elevates your everyday style, and makes every moment feel extraordinary.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="eyebrow bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-90">Shop the Collection</Link>
            <Link to="/story" className="eyebrow border border-foreground px-8 py-4 transition-colors hover:bg-foreground hover:text-background">Discover Our Story</Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div className="absolute -left-6 -top-6 hidden h-40 w-40 rounded-full bg-blush lg:block" aria-hidden />
          <img src={IMG.hero} alt="Woman in a flowing ivory silk gown" width={1280} height={1600} className="relative aspect-[4/5] w-full object-cover shadow-soft fade-up" />
          <img src={IMG.kurta} alt="Blush embroidered kurta set" loading="lazy" className="absolute -bottom-8 -left-8 hidden w-40 border-8 border-background object-cover shadow-soft md:block" />
        </div>
      </div>
    </section>
  );
}

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="Shop by Category" title="Find Your Signature Style" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <Link key={c} to="/shop" search={{ category: c }} className="reveal group relative overflow-hidden" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
            <img src={CATEGORY_IMG[c]} alt={c} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4">
              <p className="font-serif text-xl text-ivory md:text-2xl">{c}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function NewArrivals() {
  const { data, isLoading, isError } = useQuery(productsQuery());
  const items = (data ?? []).filter(isNew).slice(0, 4);
  return (
    <section className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeading eyebrow="Just In" title="New Arrivals" sub="Fresh silhouettes. Effortless confidence." />
        {isLoading ? (
          <ProductGridSkeleton />
        ) : isError ? (
          <p className="text-center text-muted-foreground">We couldn't load products right now.</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
        <div className="mt-14 text-center">
          <Link to="/shop" search={{ collection: "new-arrival" }} className="eyebrow border-b border-foreground pb-1">View All New Arrivals</Link>
        </div>
      </div>
    </section>
  );
}

export function FeaturedCollections() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="Curated" title="Featured Collections" />
      <div className="grid gap-6 md:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <div key={c.tag} className={`reveal group ${i === 1 ? "md:mt-16" : ""}`} style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="overflow-hidden">
              <img src={COLLECTION_IMG[c.tag]} alt={c.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
            </div>
            <p className="eyebrow mt-6 text-taupe">0{i + 1}</p>
            <h3 className="mt-2 text-3xl">{c.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
            <Link to="/shop" search={{ collection: c.tag }} className="eyebrow mt-5 inline-block border-b border-foreground pb-1">Explore Collection</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BrandStory({ withButton = true }: { withButton?: boolean }) {
  return (
    <section className="bg-champagne/40 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
        <img src={IMG.story} alt="SAVÉRA atelier: silk fabrics and garments" loading="lazy" className="reveal aspect-[4/5] w-full object-cover shadow-soft" />
        <div className="reveal">
          <p className="eyebrow mb-5 text-taupe">Our Story</p>
          <h2 className="text-4xl md:text-6xl">More Than Fashion. <em>A Feeling.</em></h2>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            SAVÉRA was created from a simple belief: what you wear should make you feel more like yourself. We bring together timeless elegance, contemporary design, and thoughtfully curated styles to help women express their individuality with confidence. Every collection reflects our love for fashion that feels beautiful, effortless, and personal.
          </p>
          {withButton && (
            <Link to="/story" className="eyebrow mt-10 inline-block bg-primary px-8 py-4 text-primary-foreground">Discover Our Story</Link>
          )}
        </div>
      </div>
    </section>
  );
}

const LOOKS = [
  { img: IMG.coord, cap: "Effortless Neutrals", tall: true },
  { img: IMG.kurta, cap: "The Modern Muse" },
  { img: IMG.jeans, cap: "Everyday Chic" },
  { img: IMG.skirt, cap: "Elegance in Motion", tall: true },
  { img: IMG.shirt, cap: "The Art of Minimalism" },
  { img: IMG.coat, cap: "Quiet Layers" },
];

export function Lookbook() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="Lookbook" title="The SAVÉRA Edit" sub="Styling stories for every chapter of your day." />
      <div className="columns-2 gap-4 md:columns-3">
        {LOOKS.map((l) => (
          <figure key={l.cap} className="reveal group relative mb-4 break-inside-avoid overflow-hidden">
            <img src={l.img} alt={l.cap} loading="lazy" className={`w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 ${l.tall ? "aspect-[3/5]" : "aspect-[4/5]"}`} />
            <figcaption className="absolute inset-0 flex items-end bg-ink/0 p-5 transition-colors duration-500 group-hover:bg-ink/30">
              <span className="font-serif text-2xl italic text-ivory opacity-90">{l.cap}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const CREATORS = [
  { name: "Renvija Vemuri", pos: "Left" },
  { name: "Monika Vemuri", pos: "Center" },
  { name: "Sathwika Boppuri", pos: "Right" },
];

export function Creators() {
  useReveal();
  return (
    <section id="creators" className="relative overflow-hidden bg-blush/40 py-24">
      <Sparkles className="float-slow absolute left-[8%] top-16 h-6 w-6 text-taupe" strokeWidth={1} aria-hidden />
      <Sparkles className="float-slow absolute right-[10%] top-32 h-4 w-4 text-taupe" strokeWidth={1} aria-hidden />
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal text-center">
          <p className="eyebrow mb-4 text-taupe">Meet the Creators</p>
          <h2 className="text-4xl tracking-wide md:text-6xl">THE GIRLS BEHIND SAVÉRA</h2>
          <p className="mt-4 font-serif text-xl italic text-muted-foreground">Three personalities. One vision. A little magic in every detail.</p>
        </div>

        {/* Desktop */}
        <div className="reveal relative mx-auto mt-10 hidden md:block">
          <div className="relative">
            <img src={IMG.creators} alt="Original illustration of three fashionable cartoon girls — the SAVÉRA creators" loading="lazy" width={1536} height={1024} className="w-full" />
            <svg viewBox="0 0 1536 1024" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full text-taupe" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path className="draw-line" d="M290 470 C 340 520, 380 470, 420 420" />
              <path className="draw-line" d="M408 438 L 420 420 L 400 418" />
              <path className="draw-line" d="M1246 470 C 1190 520, 1150 440, 1100 360" />
              <path className="draw-line" d="M1094 382 L 1100 360 L 1116 376" />
              <path className="draw-line" d="M720 1020 C 690 960, 760 930, 770 870" />
              <path className="draw-line" d="M756 884 L 770 870 L 780 888" />
            </svg>
            <CreatorLabel name="Renvija Vemuri" className="left-[2%] top-[42%] text-right" />
            <CreatorLabel name="Sathwika Boppuri" className="right-[2%] top-[42%]" />
          </div>
          <CreatorLabel name="Monika Vemuri" className="relative mt-2 text-center" />
        </div>

        {/* Mobile */}
        <div className="mt-10 md:hidden">
          <img src={IMG.creators} alt="Original illustration of three fashionable cartoon girls — the SAVÉRA creators" loading="lazy" className="w-full scale-[1.6]" />
          <div className="mt-12 grid grid-cols-3 gap-2 text-center">
            {CREATORS.map((c) => (
              <div key={c.name} className="reveal">
                <svg viewBox="0 0 20 40" className="mx-auto h-8 w-4 text-taupe" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M10 38 C 4 26, 16 16, 10 2 M5 8 L10 2 L15 8" />
                </svg>
                <p className="eyebrow mt-1 text-taupe">{c.pos}</p>
                <p className="mt-1 font-serif text-lg leading-tight">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">Illustrated characters inspired by our founders.</p>
      </div>
    </section>
  );
}

function CreatorLabel({ name, className }: { name: string; className: string }) {
  return (
    <div className={`absolute transition-opacity delay-1000 duration-700 [.is-visible_&]:opacity-100 opacity-0 ${className}`}>
      <p className="font-serif text-2xl italic lg:text-3xl">{name}</p>
      <p className="eyebrow mt-1 text-taupe">Co-founder</p>
    </div>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "ok" : "err");
  };
  return (
    <section id="newsletter" className="py-24">
      <div className="reveal mx-auto max-w-2xl px-5 text-center">
        <h2 className="text-4xl md:text-5xl">A Little More SAVÉRA in Your Inbox.</h2>
        <p className="mt-4 text-muted-foreground">Be the first to discover new collections, styling inspiration, and updates from our world.</p>
        {state === "ok" ? (
          <p className="mt-10 font-serif text-2xl italic" role="status">Thank you — you're on the list. (Demo: no email is sent yet.)</p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} placeholder="Your email address" className="flex-1 border-b border-foreground bg-transparent px-1 py-3 outline-none" aria-invalid={state === "err"} />
            <button className="eyebrow bg-primary px-8 py-3 text-primary-foreground">Subscribe</button>
          </form>
        )}
        {state === "err" && <p className="mt-3 text-sm text-destructive" role="alert">Please enter a valid email address.</p>}
      </div>
    </section>
  );
}

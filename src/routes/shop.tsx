import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, COLLECTIONS, productsQuery, getColor, isNew } from "@/lib/shopify";
import { ProductCard, ProductGridSkeleton } from "@/components/site/ProductCard";

type Search = {
  q?: string;
  category?: string;
  collection?: string;
  size?: string;
  color?: string;
  max?: number;
  instock?: boolean;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
};

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    collection: typeof s.collection === "string" ? s.collection : undefined,
    size: typeof s.size === "string" ? s.size : undefined,
    color: typeof s.color === "string" ? s.color : undefined,
    max: s.max ? Number(s.max) : undefined,
    instock: s.instock === true || s.instock === "true" ? true : undefined,
    sort: ["featured", "newest", "price-asc", "price-desc"].includes(s.sort as string) ? (s.sort as Search["sort"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — SAVÉRA" },
      { name: "description", content: "Shop SAVÉRA dresses, tops, kurtas, co-ord sets, trousers, skirts, outerwear and essentials." },
      { property: "og:title", content: "Shop All — SAVÉRA" },
      { property: "og:description", content: "Browse and filter the full SAVÉRA clothing collection." },
    ],
  }),
  component: Shop,
});

const PRICES = [
  { label: "Any price", v: undefined },
  { label: "Under ₹3,000", v: 3000 },
  { label: "Under ₹5,000", v: 5000 },
  { label: "Under ₹10,000", v: 10000 },
];

function Shop() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<Search>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const { data, isLoading, isError } = useQuery(productsQuery());
  const all = data ?? [];

  const sizes = useMemo(() => [...new Set(all.flatMap((p) => p.node.options.find((o) => o.name === "Size")?.values ?? []))], [all]);
  const colors = useMemo(() => [...new Set(all.map(getColor).filter(Boolean) as string[])], [all]);

  const list = useMemo(() => {
    let r = all.filter((p) => {
      const n = p.node;
      if (s.q) {
        const q = s.q.toLowerCase();
        if (!n.title.toLowerCase().includes(q) && !n.productType.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q)) return false;
      }
      if (s.category && n.productType !== s.category) return false;
      if (s.collection && !n.tags.includes(s.collection)) return false;
      if (s.size && !n.variants.edges.some((v) => v.node.availableForSale && v.node.selectedOptions.some((o) => o.value === s.size))) return false;
      if (s.color && getColor(p) !== s.color) return false;
      if (s.max && Number(n.priceRange.minVariantPrice.amount) > s.max) return false;
      if (s.instock && !n.availableForSale) return false;
      return true;
    });
    const price = (p: (typeof r)[number]) => Number(p.node.priceRange.minVariantPrice.amount);
    if (s.sort === "price-asc") r = [...r].sort((a, b) => price(a) - price(b));
    if (s.sort === "price-desc") r = [...r].sort((a, b) => price(b) - price(a));
    if (s.sort === "newest") r = [...r].sort((a, b) => b.node.createdAt.localeCompare(a.node.createdAt));
    if (!s.sort || s.sort === "featured") r = [...r].sort((a, b) => Number(isNew(b)) - Number(isNew(a)));
    return r;
  }, [all, s]);

  const title = s.collection === "new-arrival" ? "New Arrivals" : COLLECTIONS.find((c) => c.tag === s.collection)?.name ?? s.category ?? "Shop All";
  const chip = (on: boolean) => `border px-3 py-1.5 text-xs transition-colors ${on ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-12 text-center">
        <p className="eyebrow text-taupe">SAVÉRA</p>
        <h1 className="mt-3 text-5xl md:text-6xl">{title}</h1>
      </div>
      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div>
            <label htmlFor="shop-q" className="eyebrow mb-3 block">Search</label>
            <input id="shop-q" value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Search products" className="w-full border-b bg-transparent py-2 outline-none focus:border-foreground" />
          </div>
          <Filter title="Category">
            <button className={chip(!s.category)} onClick={() => set({ category: undefined })}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c} className={chip(s.category === c)} onClick={() => set({ category: s.category === c ? undefined : c })}>{c}</button>
            ))}
          </Filter>
          <Filter title="Collection">
            {[{ tag: "new-arrival", name: "New Arrivals" }, ...COLLECTIONS].map((c) => (
              <button key={c.tag} className={chip(s.collection === c.tag)} onClick={() => set({ collection: s.collection === c.tag ? undefined : c.tag })}>{c.name}</button>
            ))}
          </Filter>
          <Filter title="Price">
            {PRICES.map((p) => (
              <button key={p.label} className={chip(s.max === p.v)} onClick={() => set({ max: p.v })}>{p.label}</button>
            ))}
          </Filter>
          {sizes.length > 0 && (
            <Filter title="Size">
              {sizes.map((z) => (
                <button key={z} className={chip(s.size === z)} onClick={() => set({ size: s.size === z ? undefined : z })}>{z}</button>
              ))}
            </Filter>
          )}
          {colors.length > 0 && (
            <Filter title="Color">
              {colors.map((c) => (
                <button key={c} className={chip(s.color === c)} onClick={() => set({ color: s.color === c ? undefined : c })}>{c}</button>
              ))}
            </Filter>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.instock} onChange={(e) => set({ instock: e.target.checked || undefined })} className="accent-foreground" />
            In stock only
          </label>
          <Link to="/shop" className="eyebrow block text-muted-foreground underline">Clear all</Link>
        </aside>
        <div>
          <div className="mb-8 flex items-center justify-between border-b pb-4">
            <p className="text-sm text-muted-foreground">{isLoading ? "Loading…" : `${list.length} piece${list.length !== 1 ? "s" : ""}`}</p>
            <label className="flex items-center gap-2 text-sm">
              <span className="eyebrow">Sort</span>
              <select value={s.sort ?? "featured"} onChange={(e) => set({ sort: e.target.value as Search["sort"] })} className="border bg-background px-2 py-1.5">
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
          {isLoading ? (
            <ProductGridSkeleton n={6} />
          ) : isError ? (
            <p className="py-20 text-center text-muted-foreground">We couldn't load products. Please refresh.</p>
          ) : list.length === 0 ? (
            <p className="py-20 text-center font-serif text-2xl">No products found</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">
              {list.map((p) => <ProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type ShopifyProduct, formatINR, getColor, isNew } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/useHydrated";

export function WishButton({ handle, className = "" }: { handle: string; className?: string }) {
  const hydrated = useHydrated();
  const on = useWishlist((s) => s.handles.includes(handle));
  const toggle = useWishlist((s) => s.toggle);
  const active = hydrated && on;
  return (
    <button
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        const added = toggle(handle);
        toast(added ? "Added to wishlist" : "Removed from wishlist");
      }}
      className={`transition-transform active:scale-125 ${className}`}
    >
      <Heart className={`h-5 w-5 transition-colors ${active ? "fill-foreground" : ""}`} strokeWidth={1.25} />
    </button>
  );
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const p = product.node;
  const [size, setSize] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const [busy, setBusy] = useState(false);
  const sizeOpt = p.options.find((o) => o.name === "Size");
  const color = getColor(product);
  const img = p.images.edges[0]?.node;

  const add = async () => {
    if (sizeOpt && !size) {
      toast("Please select a size first");
      return;
    }
    const v = p.variants.edges.find((e) => !size || e.node.selectedOptions.some((o) => o.value === size))?.node;
    if (!v) return;
    setBusy(true);
    const ok = await addItem({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity: 1, selectedOptions: v.selectedOptions });
    setBusy(false);
    if (ok) {
      toast.success(`${p.title} added to bag`, { position: "top-center" });
      setOpen(true);
    } else toast.error("Couldn't add to bag. Please try again.");
  };

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-muted">
        <Link to="/product/$handle" params={{ handle: p.handle }}>
          {img ? (
            <img src={img.url} alt={img.altText ?? p.title} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center font-serif text-taupe">SAVÉRA</div>
          )}
        </Link>
        {isNew(product) && <span className="eyebrow absolute left-3 top-3 bg-background px-2 py-1">New</span>}
        <WishButton handle={p.handle} className="absolute right-3 top-3 rounded-full bg-background/80 p-2" />
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/95 p-3 transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0 max-lg:translate-y-0">
          {sizeOpt && (
            <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Select size">
              {sizeOpt.values.map((s) => (
                <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`min-w-8 border px-2 py-1 text-[11px] transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <button onClick={add} disabled={busy} className="eyebrow flex w-full items-center justify-center bg-primary py-2.5 text-primary-foreground transition-opacity hover:opacity-90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to bag"}
          </button>
        </div>
      </div>
      <Link to="/product/$handle" params={{ handle: p.handle }} className="mt-4 block">
        <p className="eyebrow text-muted-foreground">{p.productType}</p>
        <h3 className="mt-1 font-serif text-xl">{p.title}</h3>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span>{formatINR(p.priceRange.minVariantPrice.amount)}</span>
          {color && <span className="text-muted-foreground">{color}</span>}
        </div>
      </Link>
    </article>
  );
}

export function ProductGridSkeleton({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse bg-muted" />
      ))}
    </div>
  );
}

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { productQuery, formatINR, getColor } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { WishButton } from "@/components/site/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Product — SAVÉRA" },
      { name: "description", content: "Discover details, sizes and care for this SAVÉRA piece." },
      { property: "og:title", content: "SAVÉRA Product" },
      { property: "og:description", content: "A thoughtfully designed piece from SAVÉRA." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data, isLoading } = useQuery(productQuery(handle));
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!data)
    return (
      <div className="py-32 text-center">
        <h1 className="text-4xl">Product not found</h1>
        <Link to="/shop" className="eyebrow mt-6 inline-block underline">Back to shop</Link>
      </div>
    );

  const p = data.node;
  const sizeOpt = p.options.find((o) => o.name === "Size");
  const variant = p.variants.edges.find((v) => !sizeOpt || v.node.selectedOptions.some((o) => o.name === "Size" && o.value === size))?.node;
  const color = getColor(data);
  const [desc, ...rest] = p.description.split(/(?=Fabric:)/);

  const add = async () => {
    if (sizeOpt && !size) return toast("Please select a size");
    if (!variant) return;
    setBusy(true);
    const ok = await addItem({ product: data, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: qty, selectedOptions: variant.selectedOptions });
    setBusy(false);
    if (ok) {
      toast.success(`${p.title} added to bag`);
      setOpen(true);
    } else toast.error("Couldn't add to bag");
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-2">
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        {p.images.edges.length > 1 && (
          <div className="flex gap-3 md:flex-col">
            {p.images.edges.map((e, i) => (
              <button key={e.node.url} onClick={() => setImg(i)} className={`w-20 border ${i === img ? "border-foreground" : "border-transparent"}`}>
                <img src={e.node.url} alt="" className="aspect-[3/4] object-cover" />
              </button>
            ))}
          </div>
        )}
        <img src={p.images.edges[img]?.node.url} alt={p.images.edges[img]?.node.altText ?? p.title} className="aspect-[3/4] w-full flex-1 bg-muted object-cover fade-up" />
      </div>
      <div className="lg:pt-8">
        <Link to="/shop" search={{ category: p.productType }} className="eyebrow text-taupe">{p.productType}</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h1 className="text-4xl md:text-5xl">{p.title}</h1>
          <WishButton handle={p.handle} className="mt-2" />
        </div>
        <p className="mt-4 text-2xl">{formatINR(variant?.price.amount ?? p.priceRange.minVariantPrice.amount)}</p>
        <p className="mt-6 leading-relaxed text-muted-foreground">{desc}</p>
        {color && <p className="mt-6 text-sm"><span className="eyebrow mr-3">Color</span>{color}</p>}
        {sizeOpt && (
          <div className="mt-6">
            <div className="mb-3 flex justify-between">
              <span className="eyebrow">Size</span>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
              {sizeOpt.values.map((z) => {
                const avail = p.variants.edges.some((v) => v.node.availableForSale && v.node.selectedOptions.some((o) => o.value === z));
                return (
                  <button key={z} disabled={!avail} onClick={() => setSize(z)} aria-pressed={size === z} className={`min-w-12 border px-3 py-2.5 text-sm transition-colors disabled:opacity-30 ${size === z ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>
                    {z}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <div className="flex items-center border">
            <button aria-label="Decrease quantity" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
            <span className="w-8 text-center" aria-live="polite">{qty}</span>
            <button aria-label="Increase quantity" className="p-3" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></button>
          </div>
          <button onClick={add} disabled={busy || (variant ? !variant.availableForSale : false)} className="eyebrow flex flex-1 items-center justify-center bg-primary py-4 text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : variant && !variant.availableForSale ? "Sold out" : "Add to bag"}
          </button>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          <AccordionItem value="fabric">
            <AccordionTrigger className="eyebrow">Fabric & Care</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{rest.join(" ") || "Care details coming soon."}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="size">
            <AccordionTrigger className="eyebrow">Size Guide</AccordionTrigger>
            <AccordionContent>
              <table className="w-full text-sm text-muted-foreground">
                <thead><tr className="text-left text-foreground"><th>Size</th><th>Bust (in)</th><th>Waist (in)</th><th>Hip (in)</th></tr></thead>
                <tbody>
                  {[["XS", 32, 26, 35], ["S", 34, 28, 37], ["M", 36, 30, 39], ["L", 38, 32, 41], ["XL", 40, 34, 43]].map((r) => (
                    <tr key={r[0]}>{r.map((c) => <td key={c} className="py-1">{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs">Jeans are sized by waist in inches. Guide is indicative.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery">
            <AccordionTrigger className="eyebrow">Delivery & Returns</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">Delivery timelines and return policy will be shared here soon. Shipping is calculated at checkout.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="reviews">
            <AccordionTrigger className="eyebrow">Reviews</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">No reviews yet.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

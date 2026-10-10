import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/shopify";
import { useWishlist } from "@/stores/wishlistStore";
import { ProductCard, ProductGridSkeleton } from "@/components/site/ProductCard";
import { useHydrated } from "@/hooks/useHydrated";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SAVÉRA" },
      { name: "description", content: "Your saved SAVÉRA pieces." },
      { property: "og:title", content: "Wishlist — SAVÉRA" },
      { property: "og:description", content: "The pieces you love, all in one place." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const hydrated = useHydrated();
  const handles = useWishlist((s) => s.handles);
  const { data, isLoading } = useQuery(productsQuery());
  const items = (data ?? []).filter((p) => handles.includes(p.node.handle));
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <h1 className="mb-12 text-center text-5xl md:text-6xl">Your Wishlist</h1>
      {!hydrated || isLoading ? (
        <ProductGridSkeleton />
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">You haven't saved anything yet.</p>
          <Link to="/shop" className="eyebrow mt-6 inline-block bg-primary px-8 py-4 text-primary-foreground">Explore the shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.node.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

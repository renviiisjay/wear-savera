import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/stores/wishlistStore";
import { useHydrated } from "@/hooks/useHydrated";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "New Arrivals", search: { collection: "new-arrival" } },
  { to: "/collections", label: "Collections" },
  { to: "/story", label: "Our Story" },
  { to: "/creators", label: "Meet the Creators" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const setOpen = useCartStore((s) => s.setOpen);
  const wishCount = useWishlist((s) => s.handles.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(false);
    navigate({ to: "/shop", search: q ? { q } : {} });
  };

  const badge = (n: number) =>
    hydrated && n > 0 ? (
      <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">{n}</span>
    ) : null;

  return (
    <>
      <div className="bg-primary py-2 text-center text-[11px] uppercase tracking-[0.3em] text-primary-foreground">
        Discover your style. Wear your confidence.
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Menu className="h-5 w-5" strokeWidth={1.25} />
          </button>
          <Link to="/" className="font-serif text-2xl tracking-[0.25em] lg:text-3xl">SAVÉRA</Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                {...("search" in n ? { search: n.search } : {})}
                className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                activeOptions={{ exact: true, includeSearch: true }}
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button aria-label="Search" onClick={() => setSearch(true)}>
              <Search className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <Link to="/wishlist" aria-label="Wishlist" className="relative">
              <Heart className="h-5 w-5" strokeWidth={1.25} />
              {badge(wishCount)}
            </Link>
            <button aria-label="Shopping bag" className="relative" onClick={() => setOpen(true)}>
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {badge(cartCount)}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-background p-6 fade-up lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl tracking-[0.25em]">SAVÉRA</span>
            <button aria-label="Close menu" onClick={() => setMenu(false)}>
              <X className="h-6 w-6" strokeWidth={1.25} />
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} {...("search" in n ? { search: n.search } : {})} onClick={() => setMenu(false)} className="font-serif text-3xl">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="bg-background">
          <DialogTitle className="font-serif text-2xl font-normal">Search SAVÉRA</DialogTitle>
          <form onSubmit={submit} className="flex gap-2 border-b pb-2">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Dresses, kurtas, linen…" className="flex-1 bg-transparent py-2 outline-none" aria-label="Search products" />
            <button type="submit" aria-label="Submit search"><Search className="h-5 w-5" strokeWidth={1.25} /></button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

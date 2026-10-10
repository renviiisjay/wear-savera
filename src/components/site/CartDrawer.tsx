import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatINR } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, checkoutUrl, syncCart, isOpen, setOpen } = useCartStore();
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const checkout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-3xl font-normal">Your Bag</SheetTitle>
          <SheetDescription>{count === 0 ? "Your bag is empty" : `${count} item${count !== 1 ? "s" : ""}`}</SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-10 w-10 text-taupe" strokeWidth={1} />
            <p className="text-muted-foreground">Nothing here yet.</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 border-b pb-5">
                  <div className="h-28 w-20 flex-shrink-0 overflow-hidden bg-muted">
                    {item.product.node.images.edges[0] && (
                      <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-lg leading-tight">{item.product.node.title}</h4>
                      <button aria-label="Remove item" onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(" · ")}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border">
                        <button aria-label="Decrease" className="p-2" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button aria-label="Increase" className="p-2" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm">{formatINR(parseFloat(item.price.amount) * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t p-4">
              <div className="flex justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-xl">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at secure Shopify checkout.</p>
              <Button onClick={checkout} className="w-full" size="lg" disabled={isLoading || isSyncing}>
                {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
              </Button>
              <button onClick={() => setOpen(false)} className="w-full text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

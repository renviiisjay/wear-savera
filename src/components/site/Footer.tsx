import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/shopify";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-serif text-4xl tracking-[0.25em]">SAVÉRA</p>
          <p className="mt-3 font-serif text-xl italic text-champagne">Wear Your Confidence.</p>
          <p className="mt-6 text-sm opacity-60">Contact: hello@[your-domain] · +91 [phone number]</p>
          <p className="mt-2 text-sm opacity-60">Instagram · Pinterest · YouTube (links coming soon)</p>
        </div>
        <div>
          <p className="eyebrow mb-5 text-champagne">Explore</p>
          <ul className="space-y-3 text-sm opacity-80">
            <li><Link to="/shop">Shop All</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/story">Our Story</Link></li>
            <li><Link to="/creators">Meet the Creators</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/" hash="newsletter">Newsletter</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-champagne">Shop</p>
          <ul className="space-y-3 text-sm opacity-80">
            {CATEGORIES.map((c) => (
              <li key={c}><Link to="/shop" search={{ category: c }}>{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-champagne">Help</p>
          <ul className="space-y-3 text-sm opacity-80">
            <li><Link to="/policies/$slug" params={{ slug: "privacy" }}>Privacy Policy</Link></li>
            <li><Link to="/policies/$slug" params={{ slug: "terms" }}>Terms & Conditions</Link></li>
            <li><Link to="/policies/$slug" params={{ slug: "shipping" }}>Shipping & Returns</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs opacity-50">© {new Date().getFullYear()} SAVÉRA. All rights reserved.</div>
    </footer>
  );
}

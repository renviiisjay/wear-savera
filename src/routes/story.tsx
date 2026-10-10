import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandStory, Creators } from "@/components/site/Sections";
import { useReveal } from "@/hooks/useCartSync";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — SAVÉRA" },
      { name: "description", content: "SAVÉRA was created from a simple belief: what you wear should make you feel more like yourself." },
      { property: "og:title", content: "Our Story — SAVÉRA" },
      { property: "og:description", content: "More than fashion. A feeling." },
    ],
  }),
  component: Story,
});

function Story() {
  useReveal();
  return (
    <>
      <BrandStory withButton={false} />
      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-24 text-center md:grid-cols-3">
        {[
          ["Timeless", "Silhouettes designed to be worn and loved for years."],
          ["Personal", "Pieces that adapt to you, not the other way around."],
          ["Effortless", "Thoughtful fabrics and easy, confident combinations."],
        ].map(([t, d]) => (
          <div key={t} className="reveal">
            <h3 className="text-3xl italic">{t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <Creators />
      <div className="py-16 text-center">
        <Link to="/shop" className="eyebrow bg-primary px-8 py-4 text-primary-foreground">Shop the Collection</Link>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Hero, Categories, NewArrivals, FeaturedCollections, BrandStory, Lookbook, Creators, Newsletter } from "@/components/site/Sections";
import { useReveal } from "@/hooks/useCartSync";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAVÉRA — Style That Speaks. Confidence That Lasts." },
      { name: "description", content: "Discover SAVÉRA: thoughtfully curated women's clothing — dresses, kurtas, co-ords and everyday essentials." },
      { property: "og:title", content: "SAVÉRA — Wear Your Confidence" },
      { property: "og:description", content: "Thoughtfully curated women's clothing that celebrates your individuality." },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <FeaturedCollections />
      <BrandStory />
      <Lookbook />
      <Creators />
      <Newsletter />
    </>
  );
}

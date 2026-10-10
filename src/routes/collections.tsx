import { createFileRoute } from "@tanstack/react-router";
import { FeaturedCollections, Lookbook } from "@/components/site/Sections";
import { useReveal } from "@/hooks/useCartSync";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — SAVÉRA" },
      { name: "description", content: "Explore Everyday Elegance, Modern Indian Muse and the Minimalist Wardrobe by SAVÉRA." },
      { property: "og:title", content: "Collections — SAVÉRA" },
      { property: "og:description", content: "Three curated SAVÉRA collections for every mood." },
    ],
  }),
  component: () => {
    useReveal();
    return (
      <>
        <FeaturedCollections />
        <Lookbook />
      </>
    );
  },
});

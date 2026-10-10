import { createFileRoute } from "@tanstack/react-router";
import { Creators, Newsletter } from "@/components/site/Sections";
import { useReveal } from "@/hooks/useCartSync";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Meet the Creators — SAVÉRA" },
      { name: "description", content: "Meet Renvija Vemuri, Monika Vemuri and Sathwika Boppuri — the girls behind SAVÉRA." },
      { property: "og:title", content: "The Girls Behind SAVÉRA" },
      { property: "og:description", content: "Three personalities. One vision. A little magic in every detail." },
    ],
  }),
  component: () => {
    useReveal();
    return (
      <>
        <Creators />
        <Newsletter />
      </>
    );
  },
});

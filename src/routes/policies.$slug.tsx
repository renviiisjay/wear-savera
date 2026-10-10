import { createFileRoute, notFound } from "@tanstack/react-router";

const POLICIES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  shipping: "Shipping & Returns",
};

export const Route = createFileRoute("/policies/$slug")({
  loader: ({ params }) => {
    const title = POLICIES[params.slug];
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Policy"} — SAVÉRA` },
      { name: "description", content: `SAVÉRA ${loaderData?.title ?? "policy"}.` },
      { property: "og:title", content: `${loaderData?.title ?? "Policy"} — SAVÉRA` },
      { property: "og:description", content: `Read the SAVÉRA ${loaderData?.title ?? "policy"}.` },
    ],
  }),
  component: Policy,
});

function Policy() {
  const { title } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <h1 className="text-5xl">{title}</h1>
      <p className="mt-6 text-muted-foreground">This page is a placeholder. The full {title.toLowerCase()} will be published here soon.</p>
    </div>
  );
}

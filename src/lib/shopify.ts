import { toast } from "sonner";
import { queryOptions } from "@tanstack/react-query";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "pixel-perfect-screenshot-b0pmn-t5m005nh.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "7e3ee57f43c2829f86c6a84a20e1fdc4";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    createdAt: string;
    availableForSale: boolean;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id title description handle productType tags createdAt availableForSale
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 20) { edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } } }
  options { name values }
`;

const PRODUCTS_QUERY = `query GetProducts($first: Int!, $query: String) {
  products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) { edges { node { ${PRODUCT_FIELDS} } } }
}`;

const PRODUCT_BY_HANDLE = `query GetProduct($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 402) {
    if (typeof window !== "undefined")
      toast.error("Shopify: Payment required", {
        description: "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
      });
    return;
  }
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  return data;
}

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: async (): Promise<ShopifyProduct[]> => {
      const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
      return data?.data?.products?.edges ?? [];
    },
  });

export const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: async (): Promise<ShopifyProduct | null> => {
      const data = await storefrontApiRequest(PRODUCT_BY_HANDLE, { handle });
      const p = data?.data?.product;
      return p ? { node: p } : null;
    },
  });

export const formatINR = (amount: string | number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(amount));

export const getColor = (p: ShopifyProduct) =>
  p.node.tags.find((t) => t.startsWith("color:"))?.slice(6) ?? null;

export const isNew = (p: ShopifyProduct) => p.node.tags.includes("new-arrival");

export const CATEGORIES = [
  "Dresses",
  "Tops & Shirts",
  "Kurtas & Ethnic Wear",
  "Co-ord Sets",
  "Trousers & Jeans",
  "Skirts",
  "Outerwear",
  "Everyday Essentials",
] as const;

export const COLLECTIONS = [
  { tag: "everyday-elegance", name: "Everyday Elegance", desc: "Timeless, versatile clothing for everyday confidence." },
  { tag: "modern-indian-muse", name: "Modern Indian Muse", desc: "Contemporary Indian-inspired fashion with elegant silhouettes." },
  { tag: "minimalist-wardrobe", name: "Minimalist Wardrobe", desc: "Refined essentials, neutral tones, and effortless combinations." },
] as const;

// --- Cart ---
const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
const CART_CREATE = `mutation cartCreate($input: CartInput!) { cartCreate(input: $input) { cart { id checkoutUrl lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
const CART_ADD = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } } } userErrors { field message } } }`;
const CART_UPDATE = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } } }`;
const CART_REMOVE = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } } }`;

type UE = Array<{ field: string[] | null; message: string }>;
const notFound = (e: UE) => e.some((x) => /cart not found|does not exist/i.test(x.message));

function formatCheckoutUrl(u: string) {
  try {
    const url = new URL(u);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return u;
  }
}

export { CART_QUERY };

export async function createShopifyCart(variantId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_CREATE, { input: { lines: [{ quantity, merchandiseId: variantId }] } });
  if (data?.data?.cartCreate?.userErrors?.length) return null;
  const cart = data?.data?.cartCreate?.cart;
  const lineId = cart?.lines?.edges?.[0]?.node?.id;
  if (!cart?.checkoutUrl || !lineId) return null;
  return { cartId: cart.id as string, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId: lineId as string };
}

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_ADD, { cartId, lines: [{ quantity, merchandiseId: variantId }] });
  const ue: UE = data?.data?.cartLinesAdd?.userErrors || [];
  if (notFound(ue)) return { success: false, cartNotFound: true };
  if (ue.length) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const l = lines.find((x: { node: { merchandise: { id: string } } }) => x.node.merchandise.id === variantId);
  return { success: true, lineId: l?.node?.id as string | undefined };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_UPDATE, { cartId, lines: [{ id: lineId, quantity }] });
  const ue: UE = data?.data?.cartLinesUpdate?.userErrors || [];
  if (notFound(ue)) return { success: false, cartNotFound: true };
  return { success: ue.length === 0 };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_REMOVE, { cartId, lineIds: [lineId] });
  const ue: UE = data?.data?.cartLinesRemove?.userErrors || [];
  if (notFound(ue)) return { success: false, cartNotFound: true };
  return { success: ue.length === 0 };
}

import { blobs } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();

  const metaStore = blobs({ namespace: "metadata" });
  const catalog = await metaStore.get("catalog.json", { type: "json" }) || [];

  const results = catalog.filter(entry =>
    entry.name.toLowerCase().includes(q)
  );

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
};

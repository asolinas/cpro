import { datalog } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();

  const db = datalog("files");
  const results = await db.query(r => r.name.toLowerCase().includes(q));

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
};

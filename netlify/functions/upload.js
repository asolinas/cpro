import { blobs, datalog } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!file) return new Response("Missing file", { status: 400 });

  const filename = file.name;
  const uint8 = new Uint8Array(await file.arrayBuffer());

  const store = blobs();
  await store.set(filename, uint8);

  const db = datalog("files");
  await db.insert({ name: filename, uploaded_at: new Date().toISOString() });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

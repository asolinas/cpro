import { blobs } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file) return new Response("Missing file", { status: 400 });

  const filename = file.name;
  const uint8 = new Uint8Array(await file.arrayBuffer());

  // Save file
  const fileStore = blobs({ namespace: "files" });
  await fileStore.set(filename, uint8);

  // Update catalog
  const metaStore = blobs({ namespace: "metadata" });
  let catalog = await metaStore.get("catalog.json", { type: "json" }) || [];

  catalog = catalog.filter(x => x.name !== filename);
  catalog.push({ name: filename, uploaded_at: new Date().toISOString() });

  await metaStore.setJSON("catalog.json", catalog);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

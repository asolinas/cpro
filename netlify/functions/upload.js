export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!file) return new Response("Missing file", { status: 400 });

  const filename = file.name;
  const buffer = await file.arrayBuffer();

  const site = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  // Upload file
  await fetch(`https://api.netlify.com/api/v1/sites/${site}/blobs/files/${filename}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      "Authorization": `Bearer ${token}`
    },
    body: buffer
  });

  // Update catalog.json
  const catalogUrl = `https://api.netlify.com/api/v1/sites/${site}/blobs/metadata/catalog.json`;

  let catalog = [];
  let res = await fetch(catalogUrl, { headers: { "Authorization": `Bearer ${token}` } });
  if (res.ok) catalog = await res.json();

  catalog = catalog.filter(x => x.name !== filename);
  catalog.push({ name: filename, uploaded_at: new Date().toISOString() });

  await fetch(catalogUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(catalog)
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};

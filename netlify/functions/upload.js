export default async (req) => {
  try {
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

    // READ catalog.json via signed URL
    const catalogUrl = `https://api.netlify.com/api/v1/sites/${site}/blobs/metadata/catalog.json`;

    let signedGet = await fetch(catalogUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    let catalog = [];
    if (signedGet.ok) {
      const signedData = await signedGet.json();
      const raw = await fetch(signedData.url).then(r => r.text());
      try { catalog = JSON.parse(raw); } catch (e) { catalog = []; }
    }

    catalog = catalog.filter(x => x.name !== filename);
    catalog.push({ name: filename, uploaded_at: new Date().toISOString() });

    // Write updated catalog
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

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

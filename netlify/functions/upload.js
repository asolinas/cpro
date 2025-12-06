export default async (req) => {
  try {
    const token = process.env.NETLIFY_API_TOKEN;
    const site = process.env.NETLIFY_SITE_ID;

    console.log("DEBUG TOKEN:", token ? "PRESENT" : "MISSING");
    console.log("DEBUG SITE:", site);

    const form = await req.formData();
    const file = form.get("file");
    if (!file) return new Response("Missing file", { status: 400 });

    const filename = file.name;
    const buffer = await file.arrayBuffer();

    const url = `https://api.netlify.com/api/v1/sites/${site}/blobs/files/${filename}`;
    console.log("PUT URL:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": `Bearer ${token}`
      },
      body: buffer
    });

    console.log("PUT FILE STATUS:", response.status);

    // catalog update
    const catalogUrl = `https://api.netlify.com/api/v1/sites/${site}/blobs/metadata/catalog.json`;
    console.log("PUT CATALOG URL:", catalogUrl);

    const resCatalog = await fetch(catalogUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify([{ name: filename, uploaded_at: new Date().toISOString() }])
    });

    console.log("PUT CATALOG STATUS:", resCatalog.status);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};


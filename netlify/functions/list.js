export default async (req) => {
  try {
    const site = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_API_TOKEN;

    const catalogUrl = `https://api.netlify.com/api/v1/sites/${site}/blobs/metadata/catalog.json`;

    // Get signed URL
    const signed = await fetch(catalogUrl, {
      headers: { "Authorization": `Bearer ${token}` }
    }).then(r => r.json());

    // Download catalog content
    const content = await fetch(signed.url).then(r => r.text());

    let catalog = [];
    try { catalog = JSON.parse(content); } catch { catalog = []; }

    // filtering
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const results = catalog.filter(entry =>
      entry.name.toLowerCase().includes(q)
    );

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

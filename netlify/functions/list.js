export default async () => {
  const site = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  const catalogUrl = `https://api.netlify.com/api/v1/sites/${site}/blobs/metadata/catalog.json`;

  let catalog = [];
  let res = await fetch(catalogUrl, { headers: { "Authorization": `Bearer ${token}` } });
  if (res.ok) catalog = await res.json();

  return new Response(JSON.stringify(catalog), {
    headers: { "Content-Type": "application/json" }
  });
};

import type { APIRoute } from 'astro';

const fetchImage = (imageUrl: string) => {
  const isLocal = imageUrl.startsWith('/');
  
  return isLocal
    ? fetch(new URL(imageUrl, import.meta.env.SITE).href)
    : fetch(imageUrl);
};

export const GET: APIRoute = async ({ request }) => {
  const imageUrl = new URL(request.url).searchParams.get('url');
  
    if (!imageUrl) {
    return new Response('Missing "url" query parameter', { status: 400 });
  }

  try {
    const response = await fetchImage(imageUrl);

    if (!response.ok) {
      return new Response('Failed to fetch image', { status: 502 });
    }

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600, immutable');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (err) {
    return new Response('Error fetching image', { status: 500 });
  }
};

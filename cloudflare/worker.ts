export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      const url = new URL('/index.html', request.url);
      const indexResponse = await env.ASSETS.fetch(url.toString(), request);

      return new Response(indexResponse.body, {
        headers: indexResponse.headers,
        status: 200,
      });
    }

    return response;
  },
} satisfies ExportedHandler<Env>;

export default {
  async fetch(request, env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      const indexResponse = await env.ASSETS.fetch('http://ignored/index.html');

      return new Response(indexResponse.body, {
        headers: indexResponse.headers,
        status: 200,
      });
    }

    return response;
  },
} satisfies ExportedHandler<Env>;

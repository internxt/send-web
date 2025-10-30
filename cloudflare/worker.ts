import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request): Promise<Response> {
    try {
      // Intenta servir el asset (por ejemplo /assets/main.js)
      return await getAssetFromKV({ request });
    } catch {
      // Si no existe (por ejemplo /about o /dashboard), sirve el index.html
      const url = new URL(request.url);
      url.pathname = '/index.html';
      return await getAssetFromKV({ request: new Request(url.toString(), request) });
    }
  },
} satisfies ExportedHandler<Env>;

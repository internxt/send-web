export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    if (request.method === "POST") {
      const gscriptURL = env.GSCRIPT_WEBHOOK_URL;
      const body = await request.text();
      const resp = await fetch(gscriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const result = await resp.text();
      return new Response(result, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }
    return new Response("Method not allowed", { status: 405 });
  },
};

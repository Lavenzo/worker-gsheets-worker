export default {
  async fetch(request, env, ctx) {
    // Handle preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Proxy GET to Google Apps Script for "Enquiry" data
    if (request.method === "GET") {
      const gscriptGetURL = env.GSCRIPT_GET_URL; // Store your GET endpoint in your environment variable
      const resp = await fetch(gscriptGetURL, {
        method: "GET",
      });
      const result = await resp.text();
      return new Response(result, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Proxy POST to Google Apps Script webhook
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

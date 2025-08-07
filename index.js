export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle GET requests
    if (request.method === "GET") {
      let targetUrl;
      if (pathname.endsWith("/enquiryAll")) {
        targetUrl = env.GSCRIPT_ENQUIRY_URL;
      } else if (pathname.endsWith("/enquiryByCustomer")) {
        targetUrl = env.GSCRIPT_ENQUIRY_URL + "?groupby=customer";
      } else if (pathname.endsWith("/purchaseAll")) {
        targetUrl = env.GSCRIPT_PURCHASE_URL + "?type=purchase";
      } else if (pathname.endsWith("/purchaseByCustomer")) {
        targetUrl =
          env.GSCRIPT_PURCHASE_URL + "?type=purchase&groupby=customer";
      } else {
        return new Response("Not found", { status: 404 });
      }

      const resp = await fetch(targetUrl, { method: "GET" });
      const result = await resp.text();
      return new Response(result, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Proxy POST for new enquiries
    if (request.method === "POST" && pathname.endsWith("/enquiryAll")) {
      const body = await request.text();
      const resp = await fetch(env.GSCRIPT_ENQUIRY_URL, {
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

    // Proxy POST for new purchases (optional, if you want to support it)
    if (request.method === "POST" && pathname.endsWith("/purchaseAll")) {
      const body = await request.text();
      const resp = await fetch(env.GSCRIPT_PURCHASE_URL, {
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

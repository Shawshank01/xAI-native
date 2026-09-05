import { assertEquals } from "@std/assert";
import { handleRequest } from "./gserver.js";

Deno.test("handleRequest serves index.html on root GET /", async () => {
    const req = new Request("http://localhost:3000/");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const contentType = res.headers.get("content-type");
    assertEquals(contentType?.includes("text/html"), true);
});

Deno.test("handleRequest serves script.js with javascript content-type", async () => {
    const req = new Request("http://localhost:3000/script.js");
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    const contentType = res.headers.get("content-type");
    assertEquals(contentType?.includes("javascript"), true);
});

Deno.test("handleRequest responds to OPTIONS preflight with CORS headers", async () => {
    const req = new Request("http://localhost:3000/ask-xai", {
        method: "OPTIONS",
    });
    const res = await handleRequest(req);
    assertEquals(res.status, 200);
    assertEquals(res.headers.get("access-control-allow-origin"), "*");
    assertEquals(res.headers.get("access-control-allow-methods"), "GET, POST, OPTIONS");
});

Deno.test("handleRequest returns 404 for nonexistent files", async () => {
    const req = new Request("http://localhost:3000/non-existent-file-xyz.txt");
    const res = await handleRequest(req);
    assertEquals(res.status, 404);
});

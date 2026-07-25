import { Hono } from "@hono/hono";
import type { Context } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { serveStatic } from "@hono/hono/deno";
import {
  MetaframeDefinitionV2,
  MetaframeVersionCurrent,
} from "https://esm.sh/@metapages/metapage@1.10.11";

const port: number = parseInt(Deno.env.get("PORT") || "3000");

const DEFAULT_METAFRAME_DEFINITION: MetaframeDefinitionV2 = {
  version: MetaframeVersionCurrent,
  metadata: {
    name: "Markdown renderer",
  },
  inputs: {},
  outputs: {},
  hashParams: ["edit", "md", "bgColor", "editorWidth", "minimalheader", "hm", "modules", "definition", "options"]
};

const DEFAULT_METAFRAME_DEFINITION_STRING = JSON.stringify(
  DEFAULT_METAFRAME_DEFINITION,
  null,
  2
);

const app = new Hono();

app.use("*", cors({ origin: "*" }));

const serveIndex = async (ctx: Context) => {
  const indexHtml = await Deno.readTextFile("./index.html");
  return ctx.html(indexHtml);
};

app.get("/", serveIndex);
app.get("/index.html", serveIndex);
app.get("/metaframe.json", (ctx: Context) => {
  return ctx.body(DEFAULT_METAFRAME_DEFINITION_STRING, 200, {
    "Content-Type": "application/json",
  });
});

// The built client, copied into ./editor by `just _stage`
app.use("/editor/*", serveStatic({ root: "./" }));

// Everything else falls through to ./public, served from the root path
app.use(
  "/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => `/public${path}`,
  }),
);

console.log(`🚀 Listening on: http://localhost:${port}`);
// Deno Deploy binds `Deno.serve` to its own socket, so this port only applies
// locally. The previous oak stack used Deno.listen/Deno.serveHttp, which Deploy
// does NOT intercept: the app came up on :3000 but warm-up could never reach it.
Deno.serve({ port }, app.fetch);

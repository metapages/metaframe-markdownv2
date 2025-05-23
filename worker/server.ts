import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.6/mod.ts";
import {
  MetaframeDefinitionV1,
  MetaframeVersionCurrent,
} from "https://esm.sh/@metapages/metapage@1.1.0";

const port: number = parseInt(Deno.env.get("PORT") || "3000");

const DEFAULT_METAFRAME_DEFINITION: MetaframeDefinitionV1 = {
  version: MetaframeVersionCurrent,
  metadata: {
    name: "Markdown renderer",
    // operations: {
    //   edit: {
    //     type: "url",
    //     url: "https://js.mtfm.io/#?edit=1",
    //     params: [
    //       {
    //         from: "js",
    //         to: "js",
    //       },
    //       {
    //         from: "modules",
    //         to: "modules",
    //       },
    //       {
    //         from: "c",
    //         to: "c",
    //       },
    //     ],
    //   },
    // },
  },
  inputs: {},
  outputs: {},
};

const DEFAULT_METAFRAME_DEFINITION_STRING = JSON.stringify(
  DEFAULT_METAFRAME_DEFINITION,
  null,
  2
);

// const certFile = "../.certs/server1.localhost.pem",
//   keyFile = "../.certs/server1.localhost-key.pem";

const router = new Router();

const serveIndex = async (ctx: Context) => {
  const indexHtml = await Deno.readTextFile("./index.html");
  ctx.response.body = indexHtml;
};

router.get("/", serveIndex);
router.get("/index.html", serveIndex);
router.get("/metaframe.json", (ctx: Context) => {
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = DEFAULT_METAFRAME_DEFINITION_STRING;
});
// After creating the router, we can add it to the app.

const app = new Application();
app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `🚀 Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? "localhost"
    }:${port}`
  );
});
app.use(oakCors({ origin: "*" }));

app.use(
  staticFiles("editor", {
    prefix: "/editor",
    setHeaders: (headers: Headers) => {
      headers.set("Access-Control-Allow-Origin", "*");
    },
  })
);

app.use(
  staticFiles("public", {
    // prefix: "/editor",
    setHeaders: (headers: Headers) => {
      headers.set("Access-Control-Allow-Origin", "*");
    },
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

// await app.listen({ port, certFile, keyFile });
await app.listen({ port });

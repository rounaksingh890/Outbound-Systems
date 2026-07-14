import assert from "node:assert/strict";
import test from "node:test";

const siteOrigin = "https://outbound-systems.test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`${siteOrigin}/`, {
      headers: {
        accept: "text/html",
        "x-forwarded-host": "outbound-systems.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

let renderedHtml;

async function getHtml() {
  if (!renderedHtml) {
    const response = await render();
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    renderedHtml = await response.text();
  }

  return renderedHtml;
}

test("server-renders the complete client walkthrough and its landmarks", async () => {
  const html = await getHtml();

  assert.match(
    html,
    /<title>Outbound Systems — Interactive implementation walkthrough<\/title>/i,
  );
  assert.match(html, /<html[^>]*\blang=["']en["']/i);
  assert.match(html, /<header\b/i);
  assert.match(html, /<nav[^>]*aria-label=["']Primary navigation["']/i);
  assert.match(html, /<main[^>]*\bid=["']main-content["']/i);
  assert.match(html, /<footer\b/i);

  assert.match(html, /Outbound systems that make every reply count\./i);
  assert.match(html, /Follow Maya from target account to a decision/i);
  assert.match(html, /The quiet work that protects the sender/i);
  assert.match(html, /A Monday report that ends with a decision\./i);
  assert.match(html, /A system your team can see, operate, and inherit\./i);
  assert.match(html, /Questions a client should ask before an outbound build\./i);
});

test("keeps illustrative demo data unmistakably disclosed", async () => {
  const html = await getHtml();

  assert.match(html, /Interactive portfolio demonstration/i);
  assert.match(
    html,
    /Synthetic people and illustrative campaign data\.[\s\S]*?not client results/i,
  );
  assert.match(html, /Illustrative 6-week cohort[^<]*synthetic records/i);
  assert.match(
    html,
    /fictional campaign cohort[\s\S]*?not to imply historical client performance/i,
  );
  assert.match(html, /This demo stores no lead data\./i);
});

test("renders all six stages of the connected outbound system", async () => {
  const html = await getHtml();
  const stages = ["Target", "Enrich", "Verify", "Engage", "Route", "Learn"];

  for (const stage of stages) {
    assert.match(html, new RegExp(`>${stage}<`, "i"), `missing ${stage} stage`);
  }

  assert.match(html, /role=["']tablist["'][^>]*aria-label=["']Outbound system stages["']/i);
  assert.match(html, /role=["']tabpanel["']/i);
  assert.match(html, /Executive view/i);
  assert.match(html, /Operator view/i);
  assert.match(html, /Run the lead journey demo/i);
});

test("publishes accessible, share-ready document metadata", async () => {
  const html = await getHtml();

  assert.match(
    html,
    /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*initial-scale=1/i,
  );
  assert.match(html, /<meta[^>]*name=["']theme-color["'][^>]*content=["']#fcfcfd["']/i);
  assert.match(html, /<meta[^>]*name=["']description["']/i);
  assert.match(html, /<meta[^>]*property=["']og:title["']/i);
  assert.match(
    html,
    /<meta[^>]*property=["']og:image["'][^>]*content=["']https:\/\/outbound-systems\.test\/og\.png["']/i,
  );
  assert.match(html, /<meta[^>]*name=["']twitter:card["'][^>]*content=["']summary_large_image["']/i);
  assert.match(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/outbound-systems\.test[\/]?["']/i);
  assert.match(html, /href=["']#main-content["'][^>]*>Skip to main content<\/a>/i);
  assert.match(html, /type=["']application\/ld\+json["']/i);
  assert.match(html, /https:\/\/schema\.org/i);
});

test("keeps the client journey inside the interactive walkthrough", async () => {
  const html = await getHtml();
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']*)["']/gi)].map(
    ([, href]) => href,
  );

  assert.ok(hrefs.length >= 10, "expected a complete set of navigation links");
  assert.ok(!hrefs.some((href) => href === "" || href === "#"));
  assert.ok(!hrefs.some((href) => /^(?:javascript|data):/i.test(href)));
  assert.ok(!hrefs.some((href) => /example\.(?:com|org|net)/i.test(href)));

  const internalTargets = new Set(
    [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(([, id]) => id),
  );
  for (const href of hrefs.filter((value) => value.startsWith("#"))) {
    assert.ok(internalTargets.has(href.slice(1)), `missing target for ${href}`);
  }

  const externalHrefs = hrefs.filter((href) => /^https?:\/\//i.test(href));
  assert.deepEqual(externalHrefs, []);
  assert.match(
    html,
    /href=["']#system["'][^>]*>Replay the interactive walkthrough/i,
  );
  assert.doesNotMatch(html, /Open Rounak(?:’|')s GitHub|View this repository/i);
});

test("contains no starter-preview residue", async () => {
  const html = await getHtml();

  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Codex is working/i);
  assert.doesNotMatch(html, /react-loading-skeleton|sites-skeleton/i);
});

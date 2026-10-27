import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const measurementId = process.env.GA4_MEASUREMENT_ID?.trim();
if (measurementId && !/^G-[A-Z0-9]+$/.test(measurementId)) {
  throw new Error("GA4_MEASUREMENT_ID must start with G- and contain only letters and numbers");
}
const ga4Tags = measurementId
  ? '<script async src="https://www.googletagmanager.com/gtag/js?id=' + measurementId + '"></script>' +
    '<script>window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag("js",new Date());window.gtag("config","' + measurementId + '");</script>'
  : "";
const promptTags = '<link rel="stylesheet" href="/youtube-subscribe.css"><script defer src="/youtube-subscribe.js"></script>';

async function inject(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inject(path);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      let html = await readFile(path, "utf8");
      if (!html.includes("<head>") || !html.includes("</head>")) {
        throw new Error("Missing head element in " + path);
      }
      if (ga4Tags && !html.includes("googletagmanager.com/gtag/js")) {
        html = html.replace("<head>", "<head>" + ga4Tags);
      }
      if (!html.includes("/youtube-subscribe.js")) {
        html = html.replace("</head>", promptTags + "</head>");
      }
      await writeFile(path, html);
    }
  }
}

await inject(root);
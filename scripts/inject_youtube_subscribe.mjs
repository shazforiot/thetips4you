import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const tags = '<link rel="stylesheet" href="/youtube-subscribe.css"><script defer src="/youtube-subscribe.js"></script>';

async function inject(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inject(path);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      const html = await readFile(path, "utf8");
      if (html.includes("/youtube-subscribe.js")) continue;
      if (!html.includes("</head>")) throw new Error("Missing </head> in " + path);
      await writeFile(path, html.replace("</head>", tags + "</head>"));
    }
  }
}

await inject(root);
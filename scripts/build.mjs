import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const output = "dist";
if (existsSync(output)) rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const entries = ["index.html", "style.css", "script.js", "data.js", "contact-config.js", "project.js", "favicon.svg", "favicon.ico", "images", "resumes", "projects", "robots.txt", "sitemap.xml", "site.webmanifest", "CNAME"];
for (const entry of entries) cpSync(entry, join(output, entry), { recursive: true });
console.log(`Static production build created in ${output}/`);

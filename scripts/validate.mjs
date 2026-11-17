import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const htmlFiles = ["index.html", "projects/qair/index.html", "projects/datafixer/index.html", "projects/medicase/index.html", "projects/migrationguard/index.html"];
const required = ["style.css", "script.js", "data.js", "contact-config.js", "project.js", "images/profile.jpg", "resumes/Jay_Jaiswal_AI_ML_Resume.pdf", "resumes/Jay_Jaiswal_Software_Developer_Resume.pdf", "robots.txt", "sitemap.xml"];
const errors = [];

for (const file of [...htmlFiles, ...required]) {
  if (!existsSync(file)) errors.push(`Missing required file: ${file}`);
  else if (statSync(file).size === 0) errors.push(`Empty required file: ${file}`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  if (!/<html\s+lang="en"/i.test(html)) errors.push(`${file}: missing lang attribute`);
  if (!/<meta\s+name="viewport"/i.test(html)) errors.push(`${file}: missing viewport metadata`);
  const references = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(https?:|mailto:|data:)/.test(reference)) continue;
    const clean = reference.split("?")[0];
    const target = normalize(join(dirname(file), clean));
    const resolved = clean.endsWith("/") ? join(target, "index.html") : target;
    if (!existsSync(resolved)) errors.push(`${file}: broken local reference ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} routes and ${required.length} required assets.`);

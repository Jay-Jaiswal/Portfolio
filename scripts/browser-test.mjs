import { chromium } from "playwright-core";

const browser = await chromium.launch({ headless: true, executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
let formMode = "success";
let lastSubmission = "";
let ignoreExpectedFormFailureConsoleErrors = false;
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  const expectedFailure = ignoreExpectedFormFailureConsoleErrors && /400 \(Bad Request\)|net::ERR_FAILED/.test(message.text());
  if (message.type() === "error" && !expectedFailure) errors.push(`console: ${message.text()}`);
});
await page.route("https://api.web3forms.com/submit", async (route) => {
  lastSubmission = route.request().postData() || "";
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (formMode === "network") return route.abort("failed");
  if (formMode === "error") return route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ success: false }) });
  return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await page.goto("http://127.0.0.1:8000/", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".project-card");
assert(await page.locator(".project-card").count() === 4, "Expected four project cards");
assert(await page.locator(".all-repos").getAttribute("href") === "https://jay-jaiswal.github.io/", "More-projects CTA should open the project catalogue");

await page.getByRole("button", { name: "Data", exact: true }).click();
assert(await page.locator(".project-card:not(.hidden)").count() === 1, "Data filter should show one project");
assert(await page.locator(".project-card:not(.hidden) h3").textContent() === "DataFixer", "Data filter should show DataFixer");
await page.locator('.filter[data-filter="All"]').click();

await page.getByRole("button", { name: "AI/ML Engineer" }).click();
assert(await page.locator(".project-card.role-dimmed").count() === 1, "AI/ML role should de-emphasize MigrationGuard");
assert((await page.locator(".resume-toggle").textContent()).includes("AI/ML"), "AI/ML role should select the corresponding resume");

await page.locator(".resume-toggle").click();
assert(await page.locator(".resume-menu.open a").count() === 2, "Resume menu should expose two role-specific files");
assert((await page.locator(".resume-menu.open a").first().getAttribute("href")).includes("AI_ML"), "AI/ML resume should be prioritized for the selected role");

await page.locator("#terminal-input").fill("projects");
await page.locator("#terminal-form").press("Enter");
assert((await page.locator("#terminal-output").textContent()).includes("QAir"), "Terminal projects command should list QAir");

await page.locator("#contact-form button[type=submit]").click();
assert((await page.locator("#form-status").textContent()).includes("review"), "Empty contact form should show validation feedback");

async function fillContactForm(subject) {
  await page.locator("#name").fill("Portfolio QA");
  await page.locator("#email").fill("qa@example.test");
  await page.locator("#subject").fill(subject);
  await page.locator("#message").fill("Testing the Web3Forms contact flow.");
}

await fillContactForm("Success test");
const successButton = page.locator('#contact-form button[type="submit"]');
await successButton.click();
assert(await successButton.isDisabled(), "Submit button should be disabled while sending");
await page.waitForFunction(() => document.querySelector("#form-status")?.dataset.state === "success");
assert((await page.locator("#form-status").textContent()).includes("Message sent successfully"), "Successful submission should show success feedback");
assert((await page.locator("#name").inputValue()) === "", "Successful submission should clear the form");
assert(lastSubmission.includes("46310ecb-4022-42dd-be2c-107b48551883"), "Web3Forms access key should be included in the submitted FormData");

formMode = "error";
ignoreExpectedFormFailureConsoleErrors = true;
await fillContactForm("Error test");
await successButton.click();
await page.waitForFunction(() => document.querySelector("#form-status")?.dataset.state === "error");
assert((await page.locator("#form-status").textContent()).includes("Something went wrong"), "API failures should show error feedback");
assert(!(await successButton.isDisabled()), "Submit button should re-enable after an API error");

formMode = "network";
await successButton.click();
await page.waitForFunction(() => document.querySelector("#form-status")?.dataset.state === "error");
assert((await page.locator("#form-status").textContent()).includes("Something went wrong"), "Network failures should show error feedback");
formMode = "success";
ignoreExpectedFormFailureConsoleErrors = false;

for (const slug of ["qair", "datafixer", "medicase", "migrationguard"]) {
  await page.goto(`http://127.0.0.1:8000/projects/${slug}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".case-header h1");
  assert((await page.locator(".case-header h1").textContent()).trim().length > 0, `${slug} case study needs a title`);
  assert(await page.locator(".case-flow span").count() === 4, `${slug} case study needs four architecture nodes`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8000/", { waitUntil: "domcontentloaded" });
await page.locator(".menu-toggle").click();
assert(await page.locator(".mobile-menu").getAttribute("aria-hidden") === "false", "Mobile menu should open");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
assert(overflow <= 1, `Mobile page has ${overflow}px horizontal overflow`);

await browser.close();
if (errors.length) throw new Error(`Browser console errors:\n${errors.join("\n")}`);
console.log("Browser QA passed: homepage, filters, roles, resumes, terminal, Web3Forms validation/success/API-error/network-error flow, 4 case studies, mobile menu and overflow.");

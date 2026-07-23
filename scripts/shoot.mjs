/**
 * Screenshot a route so the rendered result can actually be inspected,
 * rather than inferred from markup.
 *
 *   node scripts/shoot.mjs /blog                 full page
 *   node scripts/shoot.mjs /blog 0 1200          a 1200px slice from y=0
 *
 * Width is pinned to 1440 because every Figma artboard in this project
 * is authored at 1440 — screenshotting at any other width compares the
 * design against something it never specified.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("shots", { recursive: true });

const [route = "/", top, height] = process.argv.slice(2);
const out = `shots/${route.replace(/\//g, "_") || "_home"}${top ? `_${String(top).replace(":","")}` : ""}.png`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });

// Scroll the whole page once: sections use whileInView, so anything
// never scrolled past stays at opacity 0 and would screenshot blank.
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(900);

/* Two capture modes, because they answer different questions.

   `at:<y>` scrolls there and shoots ONLY the viewport. That is the one
   to use for sticky / scroll-driven sections: a fullPage screenshot
   flattens the document and renders position:sticky at its resting
   place, so a pinned stage mid-scrub photographs as if it never moved.

   Otherwise clip out of a fullPage capture, which is fine for ordinary
   flow content and cheaper than stitching. */
if (top && String(top).startsWith("at:")) {
  const y = +String(top).slice(3);
  await page.evaluate((to) => window.scrollTo(0, to), y);
  await page.waitForTimeout(1200); // let springs and scrubs settle
  await page.screenshot({ path: out });
} else {
  await page.screenshot({
    path: out,
    fullPage: true,
    ...(top ? { clip: { x: 0, y: +top, width: 1440, height: +(height ?? 1200) } } : {}),
  });
}

const dims = await page.evaluate(() => ({
  h: document.body.scrollHeight,
  w: document.body.scrollWidth,
}));
console.log(`${out}  page ${dims.w}x${dims.h}`);

await browser.close();

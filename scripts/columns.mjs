/**
 * Report every content column on a route, so alignment is measured
 * rather than eyeballed:
 *
 *   node scripts/columns.mjs /blog
 *   WIDTH=1920 node scripts/columns.mjs /blog
 *
 * A page is consistent when this prints ONE "left:width" pair. More
 * than one means sections disagree about where the column starts or how
 * wide it is, which is the drift Container was added to remove.
 *
 * The frame is read off the page rather than hardcoded, and each
 * element's own padding is used as the gutter — so this keeps working
 * when the design tokens change, including when --gutter is a clamp()
 * that never resolves to a literal via getPropertyValue.
 */
import { chromium } from "playwright";

const route = process.argv[2] ?? "/";
const width = Number(process.env.WIDTH ?? 1440);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });

const height = await page.evaluate(() => document.body.scrollHeight);
const cols = await page.evaluate(() => {
  const frame = getComputedStyle(document.documentElement)
    .getPropertyValue("--frame")
    .trim();
  const found = [];

  for (const el of document.querySelectorAll("div,section,article,header,footer,nav")) {
    const cs = getComputedStyle(el);
    if (cs.maxWidth !== frame) continue;

    const r = el.getBoundingClientRect();
    // Responsive fallbacks (an lg:hidden mobile stack) measure zero and
    // would report as a bogus negative column.
    if (r.width === 0 || cs.display === "none") continue;

    const padL = parseFloat(cs.paddingLeft);
    const padR = parseFloat(cs.paddingRight);
    found.push(`${Math.round(r.left + padL)}:${Math.round(r.width - padL - padR)}`);
  }
  return found;
});

const unique = [...new Set(cols)];
console.log(
  `  ${route.padEnd(11)}@${String(width).padStart(5)}  ${String(height).padStart(6)}px   ` +
    `${cols.length} column(s) -> ${unique.join(", ") || "none"}` +
    (unique.length > 1 ? "   <-- INCONSISTENT" : ""),
);

await browser.close();
